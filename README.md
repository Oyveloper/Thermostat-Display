# Thermostat-Display

Thermostat-Display is a user interface for controlling a Home Assistant thermostat (climate component).
It is designed to be used on touch devices, such as a raspberry pi with a touch display attatched.  
It is also possible to use a tablet, however you would need a machiene to host the application. 

## Installation 
```bash
$ git clone https://github.com/Oyveloper/Thermostat-Display.git
$ cd thermostat
$ python3 -m venv env 
$ source env/bin/activate
$ pip install -r requirements.txt
$ npm install 
```

## Setup 
Run the server with 
```
$ python3 app.py
```

Go to http://localhost:5000/config

Here you will find al the configuration-variables:

**hass_url**: The url/ip of your homeassistant installation 
**ssl_enabled**: true if you have ssl enabled for your installation, false if not. 
**hass_password**: Used for old way of authenticating via api password (deprecated in homeassistant) (Optional)
**cilent_id**: The homeassistant ID for your climate component
**token**: Long lived access token for authenticating with homeassistant (Current recomended authentication)

This configuration could also be done by creating a `config.json` file, and setting these variables in a JSON format. 

To see the climate-controll go to http://localhost:5000

## Hosting 
There are several ways to host this project

### Method 1
The simplest is to simply run `$ python3 app.py` and make your setup open http://localhost:5000 to display the controlls
This method does not allow you to access the configuration page remotely.
This also does not allow you to use a tablet as the interface. 

### Method 2
Running with Apache and mod_wsgi (demonstrated here on a raspberry pi with raspbian setup)

For this you need apache2 setup, and then you need to install the mod_wsgi plugin. Setup a virtualhost to point to wherever you put this project (the wsgi application). 

*Further instructions on how to setup this will come...*

