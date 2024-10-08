import json
import requests

def call_api(request, restapi_id, stage):
    res = requests.post(f"https://{restapi_id}-vpce-0e1e49d8f089423a2.execute-api.eu-central-1.amazonaws.com/{stage}/ragrespond", json=request)
    out = json.loads(res.content)['response']
        
    return out

def lambda_handler(event, context):
    print(event)
    
    out = call_api(event,restapi_id="2gwh1zg1fd", stage = "development")
    print(out)
    return {"role": "assistant", "content": out}