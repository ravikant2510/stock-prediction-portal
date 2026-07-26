from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,style={'input_type': 'password'})
    class Meta:
        model = User
        fields = ['username','email','password']

    def validate_password(self, value):
        """
        Run Django's built-in password validators.
        """
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)

        return value

    def create(self,validated_data):
        # user.objects.create = save the password in a plain text
        # User.objects.create_user = automatically hash the password

        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
        )
        # user = User.objects.create_user(**validated_data)
        return user