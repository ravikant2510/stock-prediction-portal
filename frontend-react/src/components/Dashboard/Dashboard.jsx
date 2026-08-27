import { useEffect, useState } from 'react';
import axiosInstance from '../../axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
  const [ticker,setTicker] = useState('')
  const [error,setError] = useState('')
  const [loading,setLoading] = useState(false)
  const [plot,setPlot] = useState('')
  const [ma100,setMa100] = useState('')
  const [ma200,setMa200] = useState('')
  const [prediction,setPrediction] = useState('')
  const [mse,setMSE] = useState()
  const [rmse,setRMSE] = useState()
  const [r2,setR2] = useState()


  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        // const accessToken = localStorage.getItem("accessToken");
        await axiosInstance.get(
          '/protected-view/',
          {
            // headers: {
            //   Authorization: `Bearer ${accessToken}`,
            // },
          }
        );

        // console.log("Success:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProtectedData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedTicker = ticker.trim().toUpperCase();

    setLoading(true)
    setError('');
    setPlot('');
    setMa100('');
    setMa200('');
    setPrediction('');
    setMSE(undefined);
    setRMSE(undefined);
    setR2(undefined);

    try {
      const response = await axiosInstance.post('/predict/',{
        ticker: normalizedTicker
      });

      const backendRoot = import.meta.env.VITE_BACKEND_ROOT || '';
      // const plotUrl =`${Backend}${response.data_plot_img}`
      //  same for all hooks , but for stability & universal , we use lower code
      const chartVersion = Date.now();
      const toImageUrl = (path) => {
        if (!path) return '';
        const imageUrl = /^https?:\/\//i.test(path)
          ? path
          : `${backendRoot.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
        return `${imageUrl}?v=${chartVersion}`;
      };

      // setPlot(plotUrl)

      setPlot(toImageUrl(response.data.plot_img));
      setMa100(toImageUrl(response.data.plot_100_dma));
      setMa200(toImageUrl(response.data.plot_200_dma));
      setPrediction(toImageUrl(response.data.plot_prediction));
      setTicker(response.data.ticker || normalizedTicker);
      setMSE(response.data.mse)
      setRMSE(response.data.rmse)
      setR2(response.data.r2)

    } catch (err) {
      console.error("There is an error making the API request", err);
      setError(
        err.response?.data?.detail ||
        err.response?.data?.ticker?.[0] ||
        'Unable to fetch the prediction. Please try again.'
      );
    } finally{
      setLoading(false)
    }
  }

  return (
    <div className='container'>
      <div className="row">
        <div className="col-md-6 mx-auto">
          <form onSubmit={handleSubmit}>
            <input type="text" className='form-control' placeholder='Enter Stock Ticker'
            value={ticker}
            onChange={(e) => setTicker(e.target.value)} required
            />
            {error && <small className='text-danger d-block mt-1'>{error}</small>}
            <button
              type="submit"
              className='btn btn-info mt-3'
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className='me-2' />
                  Please wait...
                </>
              ) : (
                'See Prediction'
              )}
            </button>
          </form>
           {/* Print prediction plot */}

           {prediction && (
                      <div className="prediction mt-5">
               {plot && (
              <>
                <div className="p-3">
                    <img src={plot} alt={`Closing price chart for ${ticker}`} style={{ maxWidth: '100%' }} />
                </div>
                {ma100 && (
                  <div className="p-3">
                    <img src={ma100} alt={`100-day moving average for ${ticker}`} style={{ maxWidth: '100%' }} />
                  </div>
                )}
                {ma200 && (
                  <div className="p-3">
                    <img src={ma200} alt={`200-day moving average for ${ticker}`} style={{ maxWidth: '100%' }} />
                  </div>
                )}
                {prediction && (
                  <div className="p-3">
                    <img src={prediction} alt={`Final Prediction of ${ticker}`} style={{ maxWidth: '100%' }} />
                  </div>
                )}

                <div className="text-light p-3">
                  <h4>
                    Model Evaluation
                  </h4>
                  <p>Mean Squared Error (MSE): {mse}</p>
                  <p>Root Mean Squared Error (RMSE): {rmse}</p>
                  <p>R-Squared: (r2): {r2}</p>
                </div>
              </>
            )}
          </div>
           )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
