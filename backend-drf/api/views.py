from .serializers import StockPredictionSerializer
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.conf import settings
from .utils import save_plot

import numpy as np
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt
from datetime import datetime
from uuid import uuid4
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error ,r2_score

# Try to import keras, handle gracefully if not available
try:
    from keras.models import load_model
    KERAS_AVAILABLE = True
except ImportError:
    KERAS_AVAILABLE = False


class StockPredictionAPIView(APIView):
    def post(self,request):
        # Check if keras is available
        if not KERAS_AVAILABLE:
            return Response(
                {'detail': 'ML prediction service is not available in this deployment. TensorFlow/Keras is not installed.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        
        serializer=StockPredictionSerializer(data=request.data)
        if serializer.is_valid():
            ticker = serializer.validated_data['ticker'].strip().upper()
            chart_id = uuid4().hex
            #Fetch the data from yfinance
            now = datetime.now()
            start = datetime(now.year-10,now.month,now.day)
            end = now
            try:
                df = yf.download(ticker, start, end, progress=False)
            except Exception:
                return Response(
                    {'detail': 'Unable to retrieve stock data. Please try again.'},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )

            if df.empty:
                return Response(
                    {'detail': f'No data found for {ticker}.'},
                    status=status.HTTP_404_NOT_FOUND,
                )
            df = df.reset_index()
            close_prices = df['Close']
            # yfinance may return a one-column DataFrame (MultiIndex columns)
            # instead of a Series for a single ticker.
            if hasattr(close_prices, 'columns'):
                close_prices = close_prices.iloc[:, 0]

            # Basic price
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(close_prices, label='Closing price')
            plt.title(f'Closing price of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Close price')
            plt.legend()
            plot_img_path = f'{ticker}_{chart_id}_plot_img.png'
            plot_img = save_plot(plot_img_path)

            ma100 = close_prices.rolling(100).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(close_prices, label='Closing price')
            plt.plot(ma100,'r', label='100 DMA')
            plt.title(f'100-day moving average of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Close price')
            plt.legend()
            plot_img100_path = f'{ticker}_{chart_id}_100_dma.png'
            plot_100_dma = save_plot(plot_img100_path)

            # 200-day moving average
            ma200 = close_prices.rolling(200).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(close_prices, label='Closing price')
            plt.plot(ma200,'r', label='200 DMA')
            plt.title(f'200-day moving average of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Close price')
            plt.legend()
            plot_img200_path = f'{ticker}_{chart_id}_200_dma.png'
            plot_200_dma = save_plot(plot_img200_path)


            # Splitting data into Training & Testing datasets
            # ``df.Close`` can be a DataFrame when yfinance returns MultiIndex
            # columns. Use the normalized Series prepared above instead.
            data_training = close_prices.iloc[:int(len(close_prices) * 0.7)].to_frame()
            data_testing = close_prices.iloc[int(len(close_prices) * 0.7):].to_frame()

            if len(data_training) < 100 or data_testing.empty:
                return Response(
                    {'detail': f'Not enough historical data found for {ticker}.'},
                    status=status.HTTP_422_UNPROCESSABLE_ENTITY,
                )


            # Scaling down the data between 0 & 1
            scaler = MinMaxScaler(feature_range=(0,1))

            # Load the model
            model = load_model(settings.BASE_DIR / 'stock_prediction_model.keras')

            #Prepare Test Data
            past_100_days = data_training.tail(100)
            final_df = pd.concat([past_100_days,data_testing],ignore_index=True)
            input_data = scaler.fit_transform(final_df)

            x_test = []
            y_test = []
            for i in range(100,input_data.shape[0]):
                x_test.append(input_data[i-100:i])
                y_test.append(input_data[i,0])
            x_test,y_test = np.array(x_test), np.array(y_test)  

            # Making Predictions
            y_predicted = model.predict(x_test)   

            #Revert the scaled prices to original price
            y_predicted = scaler.inverse_transform(y_predicted.reshape(-1,1)).flatten()
            y_test = scaler.inverse_transform(y_test.reshape(-1,1)).flatten()



            #plot the final prediction
            plt.switch_backend('AGG')
            plt.figure(figsize=(12,5))
            plt.plot(y_test, 'b',label='original price')
            plt.plot(y_predicted, 'r',label='Predicted price')
            plt.title(f'Final Prediction of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Close price')
            plt.legend()
            plot_prediction_path = f'{ticker}_{chart_id}_final_prediction.png'
            plot_prediction = save_plot(plot_prediction_path)


            # Model Evaluation
            #Mean Square Error
            mse = mean_squared_error(y_test,y_predicted)


            # root mean square error (RMSE)
            rmse = np.sqrt(mse)


            # R-Squared
            r2 = r2_score(y_test,y_predicted)






            return Response({
                'status': 'success',
                'ticker': ticker,
                'plot_img':plot_img,
                'plot_100_dma': plot_100_dma,
                'plot_200_dma': plot_200_dma,
                'plot_prediction': plot_prediction,
                'mse': float(mse),
                'rmse': float(rmse),
                'r2': float(r2),
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
