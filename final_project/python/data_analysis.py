# %% SETUP

import os, sys, math
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
%matplotlib inline

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

# %% GET CRASH DATA

# CRASH FIELDS
crash_fields = []
with open(crash_data_dir) as f:
    crash_fields = f.readline().strip().split(',')

parse_dates = crash_fields[0:2]
dtype = dict([(crash_fields[i],'U') for i in [3,9,22,28]])
crash_data = pd.read_csv(crash_data_dir,dtype = dtype,parse_dates=parse_dates)
#data = pd.read_csv(crash_data_dir,dtype = dtype) # faster but no dates

# %% BUILDING CRASH FREQUENCY VS AVERAGE TEMPERATURE DATASET
coll_temp = pd.DataFrame(columns=('DATE', 'TMAX', 'COLLISIONS'))

for date in crash_data['DATE'].unique():
    # COUNT COLLISIONS ON THIS DAY
    collisions = len(crash_data[crash_data['DATE']==date])

    # CALCULATE TAVG ACROSS ALL WEATHER STATIONS
    TAVG = weather_data[(weather_data['DATE']==date) & (weather_data.TAVG.notnull())].TAVG.mean()

    # ADD DATA TO DATAFRAME
    coll_temp.loc[len(coll_temp)+1] = [date,TAVG,collisions]

# %% PLOT DATASET

a = plt.scatter(coll_temp.TMAX,coll_temp.COLLISIONS)

# %% BUILDING CRASH FREQUENCY VS PRECIPTATION DATASET

columns = ('DATE', 'COLLISIONS', 'PRCP', 'TMAX','TRANGE')

df_prcp_col = pd.DataFrame(columns=columns)

for date in crash_data['DATE'].unique():
    # COUNT COLLISIONS ON THIS DAY
    collisions = len(crash_data[crash_data['DATE']==date])

    # CALCULATE PRPCP ACROSS ALL WEATHER STATIONS
    PRCP = weather_data[(weather_data['DATE']==date)].PRCP.mean()

    # CALCULATE TMAX ACROSS ALL WEATHER STATIONS
    TMAX = weather_data[(weather_data['DATE']==date)].TMAX.mean()

    # CALCULATE TRANGE ACROSS ALL WEATHER STATIONS
    TMIN = weather_data[(weather_data['DATE']==date)].TMIN.mean()
    TRANGE = TMAX - TMIN

    # Collect data
    data = [date, collisions, PRCP, TMAX, TRANGE]

    # ADD DATA TO DATAFRAME
    df_prcp_col.loc[len(df_prcp_col)+1] = data


# remove days with Nan Values
len(df_prcp_col)
df_prcp_col = df_prcp_col[df_prcp_col.COLLISIONS.notnull()]
len(df_prcp_col)
df_prcp_col = df_prcp_col[df_prcp_col.PRCP.notnull()]
len(df_prcp_col)
df_prcp_col = df_prcp_col[df_prcp_col.TMAX.notnull()]
len(df_prcp_col)
df_prcp_col = df_prcp_col[df_prcp_col.TRANGE.notnull()]
len(df_prcp_col)

# %% Average number of crashes vs Preciptation

step = 2
prcp_bins = [i for i in range(int(df_prcp_col.PRCP.min()),30,step)]

n_collisions_avg = []

# Make prcp ranges
for i in prcp_bins:
    # for each range calculate average
    avg = df_prcp_col.COLLISIONS[(df_prcp_col.PRCP.between(i,i+step))].mean()
    n_collisions_avg.append(avg)


# %% plot data
fig, ax = plt.subplots()
ax.scatter(prcp_bins,n_collisions_avg)
ax.set_title('How does Precipitation affect Number of Collisions on rainy days?')
ax.set_xlabel('Preciptation', fontsize=15)
ax.set_ylabel('Average Collisions', fontsize=15)

#ax.grid(True)
fig.tight_layout()
plt.show()

# %% Average number of crashes vs Tempreture

step = 2

TMAX_min = df_prcp_col.TMAX.min()
TMAX_max = df_prcp_col.TMAX.max()

TMAX_bins = [i for i in range(int(TMAX_min),int(TMAX_max),step)]

n_collisions_avg = []

# Make prcp ranges
for i in TMAX_bins:
    # for each range calculate average
    avg = df_prcp_col.COLLISIONS[(df_prcp_col.TMAX.between(i,i+step))].mean()
    n_collisions_avg.append(avg)

# %% plot data
fig, ax = plt.subplots()
ax.scatter(TMAX_bins,n_collisions_avg)
ax.set_title('How does Precipitation affect Number of Collisions on rainy days?')
ax.set_xlabel('Tempreture', fontsize=15)
ax.set_ylabel('Average Collisions Frequency', fontsize=15)

#ax.grid(True)
fig.tight_layout()
plt.show()

# %% Average number of crashes vs Tempreture RANGE

step = 2

TRANGE_min = df_prcp_col.TRANGE.min()
TRANGE_max = df_prcp_col.TRANGE.max()

df_prcp_col.TRANGE.min()
df_prcp_col.TRANGE.max()

TRANGE_bins = [i for i in range(int(TRANGE_min),int(TRANGE_max),step)]

#TRANGE_bins

n_collisions_avg = []

# Make prcp ranges
for i in TRANGE_bins:
    # for each range calculate average
    avg = df_prcp_col.COLLISIONS[(df_prcp_col.TRANGE.between(i,i+step))].mean()
    n_collisions_avg.append(avg)

# %% plot data
fig, ax = plt.subplots()
ax.scatter(TRANGE_bins,n_collisions_avg)
ax.set_title('TITLE')
ax.set_xlabel('Tempreture Change', fontsize=15)
ax.set_ylabel('Average Collisions Frequency', fontsize=15)

#ax.grid(True)
fig.tight_layout()
plt.show()


# %% DRAUX

df_prcp_col.keys()

x_prpc = []
y_temp = []

for date in df_prcp_col.DATE.unique():
    x_prpc.append(float(df_prcp_col[df_prcp_col.DATE == date].PRCP))
    y_temp.append(float(df_prcp_col[df_prcp_col.DATE == date].TMAX))

fig, ax = plt.subplots()
ax.scatter(x_prpc,y_temp,alpha=0.3)
ax.set_title('TITLE')
ax.set_xlabel('Precipitation', fontsize=15)
ax.set_ylabel('Tempreture', fontsize=15)

#ax.grid(True)
fig.tight_layout()
plt.show()

# %%


step = 2
prcp_bins = [i for i in range(int(df_prcp_col.PRCP.min()),30,step)]

n_collisions_avg = []

# Make prcp ranges
for i in prcp_bins:
    # for each range calculate average
    avg = df_prcp_col.COLLISIONS[(df_prcp_col.PRCP.between(i,i+step))].mean()
    n_collisions_avg.append(avg)


# fig, ax = plt.subplots()
# ax.scatter(prcp_bins,n_collisions_avg)

x_p = []
y_t = []
s_c = []

for x_ in prcp_bins:
    for y_ in TMAX_bins:
        x_p.append(x_)
        y_t.append(y_)
        cond_p = (df_prcp_col.PRCP.between(x_,x_+2))
        cond_t = (df_prcp_col.TMAX.between(y_,y_+2))
        col = df_prcp_col.COLLISIONS[cond_p & cond_t].mean()
        s_c.append(col)

#[0 if ('nan' in s) else s for s in s_c]

s_c = [0 if math.isnan(x) else int(x) for x in s_c]

# plt.hist(s_c,bins=20)

fig, ax = plt.subplots()
ax.scatter(x_p,y_t,s=s_c,alpha=0.3)
ax.set_title('TITLE')
ax.set_xlabel('Precipitation', fontsize=15)
ax.set_ylabel('Tempreture', fontsize=15)

#ax.grid(True)
fig.tight_layout()
plt.show()
