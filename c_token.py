import requests
import json

# https://kauth.kakao.com/oauth/authorize?client_id=c08335d919e080518166839ce5d2a4cd&redirect_uri=https://example.com/oauth&response_type=code
url = "https://kauth.kakao.com/oauth/token"
rest_api_key = "c08335d919e080518166839ce5d2a4cd"
redirect_uri = "https://example.com/oauth"
authorize_code = "LHVRpB4-dyEUa5daJegP5RIuZvM0c3ZDW2K-Ecz7830V1PH0O8nC_LR2CRcMXtcGgr1R4Qo9cpgAAAGI_I9QBg"


def f_auth():
    data = {
        "grant_type": "authorization_code",
        "client_id": rest_api_key,
        "redirect_uri": redirect_uri,
        "code": authorize_code,
    }

    response = requests.post(url, data=data)
    tokens = response.json()

    with open("kakao_token.json", "w") as fp:
        json.dump(tokens, fp)
    with open("kakao_token.json", "r") as fp:
        ts = json.load(fp)
    r_token = ts["refresh_token"]
    return r_token


def f_auth_refresh(r_token):
    with open("kakao_token.json", "r") as fp:
        ts = json.load(fp)
    data = {
        "grant_type": "refresh_token",
        "client_id": rest_api_key,
        "refresh_token": r_token,
    }
    response = requests.post(url, data=data)
    tokens = response.json()

    with open("kakao_token.json", "w") as fp:
        json.dump(tokens, fp)
    with open("kakao_token.json", "r") as fp:
        ts = json.load(fp)
    token = ts["access_token"]
    return token


def f_send_talk(token, text):
    header = {"Authorization": "Bearer " + token}
    url = "https://kapi.kakao.com/v2/api/talk/memo/default/send"
    post = {
        "object_type": "text",
        "text": text,
        "link": {
            "web_url": "https://developers.kakao.com",
            "mobile_web_url": "https://developers.kakao.com",
        },
        "button_title": "키워드",
    }
    data = {"template_object": json.dumps(post)}
    return requests.post(url, headers=header, data=data)
