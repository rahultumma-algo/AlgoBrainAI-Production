import requests

def send_template():
    print("Hello entered template.")
    temp_name = "hello_world"
    mobile_numbers = ["918128960080"]  # Add more numbers as needed

    data = {
        "messaging_product": "whatsapp",
        "to": mobile_numbers,  # Corrected variable name
        "type": "template",
        "template": {
            "name": temp_name,
            "language": {"code": "en_US"},
        },
    }

    whatsapp_token = 'EAAMgMjEOW7ABOzt0E0tGm5USL3avUQsHuYgTFLnToWb7NIGVkDdZBP6xvX2xttC6Hbilzuzbg46WEoyn8ThS0AjVzs0IJmMgAfyFZAe4O2DGSlOvUVP8t5xbVSrHHJY9DgmfHfWr0KnZBlOZCjlJc5qbfWg2GbudUYkF1rRC83CtVtK1pdInc5EacbxwygAw'
    api_version = 'v18.0'
    endpoint = f'https://graph.facebook.com/{api_version}/165981039931485/messages'

    headers = {
        'Authorization': f'Bearer {whatsapp_token}',  # Corrected variable name
        'Content-Type': 'application/json',
    }

    response = requests.post(endpoint, headers=headers, json=data)

    if response.ok:
        print('Facebook API request sent successfully without image')
    else:
        error_data = response.json()
        raise ValueError(f'Error sending request: {error_data}')

# Example usage
send_template()
