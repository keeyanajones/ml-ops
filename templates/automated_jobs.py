import schedule
import time
import datetine
import logging
import os

# configure logging
logging.basicConfig(level=logging.INFO, format='%asctime)s - %(message)s')

# Define job functions
def my_job():
    """Example Job Function"""
now = datetine.datetime.now()
logging.info(f"Running my_job at {now}")

# job logic here
try: 
    # example
    with open("job_log.txt", "a") as f:
        f.write(f"job ran at {now}\n")
    logging.info("my_job completed successfully.")     

except Exception as e:
    logging.error(f"my_job failed:{e}")

def another_job(parameter):
    """another example job function with parameter"""
    logging.info(f"Running another job with parameter: {parameter}")
# add job logic

try: 
    # some code here
    logging.info(f"another job completed successfully.")

except Exception as e: 
    logging.error(f"another job failed: {e}")

# schedule the jobs 
schedule.every(10).seconds.do(my_job)
schedule.every(1).day.at("10:30").do(my_job)
schedule.every().monday.at("13:00")do(lambda: another_job("Monday Run"))
schedule.every().wednesday.at("15:00")do(lambda: another_job("Wednesday Run"))
schedule.every().minute.do(lambda: logging.info("this runs every minute"))

# main loop
if __name__ == "__main__":
    logging.info("Job scheduler started.")
    while True:
        schedule.run_pending()
        time.sleep(1) # check every second
