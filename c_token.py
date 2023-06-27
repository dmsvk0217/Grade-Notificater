import requests
import json


def get_token():
    url = "https://kauth.kakao.com/oauth/token"
    client_id = "c08335d919e080518166839ce5d2a4cd"
    redirect_uri = "https://example.com/oauth"
    code = "wjGSHZfJbtnXDOeYndGw8mQSNjkJ4GQ245OXoGcCqsOKHYuuSPJDX3-pE5YQQK0mdOlokQo9cxcAAAGI_E9e3w"

    data = {
        "grant_type": "authorization_code",
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "code": code,
    }

    response = requests.post(url, data=data)
    tokens = response.json()

    # 발행된 토큰 저장
    with open("token.json", "w") as kakao:
        json.dump(tokens, kakao)


def send_token():
    # 발행한 토큰 불러오기
    with open("token.json", "r") as kakao:
        tokens = json.load(kakao)

    url = "https://kapi.kakao.com/v2/api/talk/memo/default/send"

    headers = {"Authorization": "Bearer " + tokens["access_token"]}

    data = {
        "object_type": "text",
        "text": "성적이 업데이트 되었습니다!!",
        "link": {
            "web_url": "https://developers.kakao.com",
            "mobile_web_url": "https://developers.kakao.com",
        },
        "button_title": "키워드",
    }

    data = {"template_object": json.dumps(data)}
    response = requests.post(url, headers=headers, data=data)
    response.status_code
