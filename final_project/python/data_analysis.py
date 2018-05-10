# %% SETUP

import os, sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

data_dir = "/Users/DTH/Library/Mobile Documents/com~apple~CloudDocs/DTU/02806 - Social Data Analysis and Visualization/assignment1/02806_social_data/final_project/data/"
crash_data_dir = data_dir + "NYPD_Motor_Vehicle_Collisions.csv"
weather_data_dir = data_dir + "Weather.csv"

# %% GET WEATHER DATA

# GET WEATHER FIELDS
weather_fields = []
with open(weather_data_dir) as f:
    weather_fields = f.readline().strip().split(',')

# FIX WEATHER FIELD TO STRINGS
weather_fields = [w.replace('"','') for w in weather_fields]

# DATA TYPES FOR MIXED FORMAT COLUMNS
bad_columns = [6,8,16,18,20,22,24,26,28,34,36,38,40,42,44,46,48,50,52,54,56]
dtype = dict([(weather_fields[i],'str') for i in bad_columns])

# IMPORT DATA
weather_data = pd.read_csv(weather_data_dir,dtype=dtype,parse_dates=[4])

weather_fields[1]
weather_fields[4]

# %% GET CRASH DATA

# CRASH FIELDS
crash_fields = []
with open(crash_data_dir) as f:
    crash_fields = f.readline().strip().split(',')

parse_dates = crash_fields[0:2]
dtype = dict([(crash_fields[i],'U') for i in [3,9,22,28]])
crash_data = pd.read_csv(crash_data_dir,dtype = dtype,parse_dates=parse_dates)
#data = pd.read_csv(crash_data_dir,dtype = dtype) # faster but no dates

# %% DATA COMPLETENESS

for field in weather_fields:
    #print(field)
    col = weather_data[field]
    comp = 1 - len(col[col.isnull()])/len(weather_data)
    print(field,':',comp)


# %% BUILDING CRASH FREQUENCY VS AVERAGE TEMPERATURE DATASET
coll_temp = pd.DataFrame(columns=('DATE', 'TMAX', 'COLLISIONS'))

for date in crash_data['DATE'].unique():
    # COUNT COLLISIONS ON THIS DAY
    collisions = len(crash_data[crash_data['DATE']==date])

    # CALCULATE TAVG ACROSS ALL WEATHER STATIONS
    TAVG = weather_data[(weather_data['DATE']==date) & (weather_data.TAVG.notnull())].TAVG.mean()

    # ADD DATA TO DATAFRAME
    coll_temp.loc[len(foo)+1] = [date,TAVG,collisions]

# %% PLOT DATASET

a = plt.scatter(coll_temp.TMAX,coll_temp.COLLISIONS)

# %% BUILDING CRASH FREQUENCY VS PRECIPTATION DATASET

date = weather_data['DATE'][10000]
weather_data[(weather_data['DATE']==date)].PRCP.mean()

weather_data[(weather_data['DATE']==date) & (weather_data.PRCP.notnull())].PRCP.mean()


foo = pd.DataFrame(columns=('DATE', 'PRCP', 'COLLISIONS'))

for date in crash_data['DATE'].unique():
    # COUNT COLLISIONS ON THIS DAY
    collisions = len(crash_data[crash_data['DATE']==date])

    # CALCULATE TAVG ACROSS ALL WEATHER STATIONS
    PRCP = weather_data[(weather_data['DATE']==date)].PRCP.mean()

    # ADD DATA TO DATAFRAME
    foo.loc[len(foo)+1] = [date,PRCP,collisions]

foo = foo[foo.PRCP.notnull()]



x = [i for i in range(int(foo.PRCP.min()),int(foo.PRCP.max())+1)]

#sum(foo[(foo.PRCP<25) & (foo.PRCP>23)].COLLISIONS)

y = [sum(foo[(foo.PRCP>r) & (foo.PRCP<r+1)].COLLISIONS) for r in x]
y
a = plt.scatter(x,y)
