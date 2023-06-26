import pandas as pd
from bs4 import BeautifulSoup
import time
import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from tabulate import tabulate
from urllib.request import urlopen
from bs4 import BeautifulSoup
import json
from difflib import SequenceMatcher

# Initialize previous data as an empty string or load it from a persistent storage
previous_data = ""

# Function to send a notification
def send_notification(message):
  print(message)

# Function to crawl the table and return the data
def crawl_table():
  options = Options()
  options.add_argument("--headless")  # Example: adding a headless argument
  driver_path = '/home/bdh/chromedriver'
  service = Service(driver_path)
  print("debug1")

  driver = webdriver.Chrome(service=service, options=options)

  driver.get("https://hisnet.handong.edu")

  id_x_path='//*[@id="loginBoxBg"]/table[2]/tbody/tr/td[5]/form/table/tbody/tr[3]/td/table/tbody/tr/td[1]/table/tbody/tr[1]/td[2]/span/input'
  password_x_path='//*[@id="loginBoxBg"]/table[2]/tbody/tr/td[5]/form/table/tbody/tr[3]/td/table/tbody/tr/td[1]/table/tbody/tr[3]/td[2]/input'
  login_x_path='//*[@id="loginBoxBg"]/table[2]/tbody/tr/td[5]/form/table/tbody/tr[3]/td/table/tbody/tr/td[2]/input'
  url = 'https://hisnet.handong.edu/haksa/record/HREC130M.php'

  # Switch to the frame
  frame = WebDriverWait(driver, 1).until(
      EC.frame_to_be_available_and_switch_to_it((By.XPATH, '/html/frameset/frame[1]'))
  )

  id_input = WebDriverWait(driver, 1).until(
      EC.visibility_of_element_located((By.XPATH, id_x_path))
  )
  id_input.send_keys('dmsvk01')
  password_input = driver.find_element(By.XPATH, password_x_path)
  password_input.send_keys('111111')
  login_button = driver.find_element(By.XPATH, login_x_path)
  login_button.click()

  # Switch back to the default content
  driver.switch_to.default_content()

  # Navigate to the website
  driver.get(url)
  table = driver.find_element(By.ID, 'att_list')
  table_html = table.get_attribute("innerHTML")
  soup = BeautifulSoup(table_html, "html.parser")
  
  table_data = []
  for row in soup.find_all("tr"):
      row_data = []
      for index, cell in enumerate(row.find_all(["td", "th"]), start=1):
          row_data.append(cell.get_text().strip())
      table_data.append(row_data)

  # Print the table in a tabular format
  print(tabulate(table_data, headers="firstrow", tablefmt="grid"))
  driver.quit()
  return table_data

def convert_to_hashable(data):
    if isinstance(data, list):
        # Convert lists to tuples
        return tuple(convert_to_hashable(item) for item in data)
    elif isinstance(data, dict):
        # Recursively convert dictionary values
        return {key: convert_to_hashable(value) for key, value in data.items()}
    else:
        # Other types remain unchanged
        return data

while True:
    current_data = crawl_table()
    
    current_data_hashable = convert_to_hashable(current_data)
    previous_data_hashable = convert_to_hashable(previous_data)

    similarity_ratio = SequenceMatcher(None, previous_data_hashable, current_data_hashable).ratio()
    if similarity_ratio < 1.0:
            send_notification("Data mismatch detected!")
    previous_data = current_data
    time.sleep(30)