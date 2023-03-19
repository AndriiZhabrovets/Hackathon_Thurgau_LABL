# Hackathon Thurgau 2023

# Links 🔗

## Python 🐍

Pandas:

[Introduction to Pandas in Python - GeeksforGeeks](https://www.geeksforgeeks.org/introduction-to-pandas-in-python/)

CSV:

[Working with csv files in Python - GeeksforGeeks](https://www.geeksforgeeks.org/working-csv-files-python/?ref=lbp)

Matplotlib:

[Matplotlib Tutorial - GeeksforGeeks](https://www.geeksforgeeks.org/matplotlib-tutorial/?ref=lbp)

Numpy:

[NumPy Tutorial - GeeksforGeeks](https://www.geeksforgeeks.org/numpy-tutorial/?ref=lbp)

Selenium:

[Selenium Python Tutorial - GeeksforGeeks](https://www.geeksforgeeks.org/selenium-python-tutorial/?ref=lbp)

Django:

[Django Tutorial - GeeksforGeeks](https://www.geeksforgeeks.org/django-tutorial/?ref=lbp)

Choosing DB:

[Python Databases 101: How to Choose a Database Library | Built In](https://builtin.com/data-science/python-database)

Jupyter Notebook:

[Getting started with Jupyter Notebook | Python - GeeksforGeeks](https://www.geeksforgeeks.org/getting-started-with-jupyter-notebook-python/)

## Web-dev 🕸️

# Teacher’s Notes

## Hackathon Example

The goal of the hackathon is to combine energy data and visualize interesting results. To do this, it's best to use Jupyter notebooks like this one.

In a notebook, we can combine Markdown code with Python, keep adjusting the individual code blocks, and inspect the results.

## Tools

### Python

Of course. **Download here.**

### Jupyter Notebook Extension

Extension of Visual Studio Code. Install here.

### Libraries

- Matplotlib: A Python library (i.e. a collection of functions) to create nice graphics with Python.
- Pandas: Data science library (Intro)
- Geopandas: Extensions for Pandas to handle geodata - Intro
- Folium: Creating web pages with geo content.

Installation

In general, common libraries can be installed from the terminal with pip

```python
python -m pip install matplotlib pandas folium
```

Alternatively, we can simply make sure that the kernel running the Python code of this

notebook has the library installed:

```python
import sys
!{sys.executable} -m pip install matplotlib pandas folium geopandas geopy mapclassify
```

### Comma-Separated Values

We want to process the publicly available data sets. The tabular data is often in CSV (Comma-Separated Values) format. Here, each row represents represents one entry, where the values of the individual columns are separated by commas (sometimes semicolons). If a value contains a comma, the value may be enclosed in quotes. The first line often contains the column names:

Zip code,City,Inhabitants

8590, Romanshorn, 11296

8580, Amriswil, 14157

9320, Arbon, 14872

We are about to use the Pandas library to read CSV.

For example, we want to work with the energy production data of the Thurgau municipalities. The dataset can be found at https://data.tg.ch/explore/dataset/div-energie-10/table/, the link to the CSV download can be found at Exports. The download uses semicolons.

We also take the column names from the website to get the municipality and its energy production.

```python
import pandas as pd

source = 'https://data.tg.ch/api/explore/v2.1/catalog/datasets/div-energie-10/exports/csv'

# Read CSV data with Pandas.
# Attention: we use semicolons instead of commas as separators.
# header=0 tells the function that we expect column headers in the file.
energy_dataset = pd.read_table(source, sep=';', header=0)
# What does the data look like?
energy_dataset
```

For starters, we are only interested in the 2020 values, and we only want the municipality and the total energy production. We can filter the data by passing a boolean array that has the same length as the dataset. We can restrict columns by passing a list of the desired column names.

```python
only2020 = energy_dataset[energy_dataset['jahr'] == 2020]
only2020[['bfs_nr_gemeinde', 'gemeinde_name', 'total']]
```

### Task 1: Generate data

Create a dataset similar to **only2020**, but add an additional column **strom_pro_kopf** that calculates electricity production per inhabitant.

### Summarize and visualize data

We want to visualize the data as a map. In the **data** folder it has a dataset that contains the boundaries of all Swiss entities (municipalities, districts, cantons) as polygons. It is in JSON format, so it looks like this:

{

"type": "Feature",

"properties": {

"bfs_nr_municipality": 3762,

"country": "CH",

"type": "municipality",

"name": "Scuol"

},

"geometry": {

"type": "MultiPolygon",

"coordinates": [ [ 1139077.5319999890104, 5921141.517 ], ...] ] ]

}

}

...

Geopandas allows us to read and inspect this format directly. It is worth to execute this step in a separate block, because 90MByte of data are read in after all.

```python
import geopandas as gpd
municipalities = gpd.read_file("../data/towns_fixed.geojson")
municipalities
```

### Join

Now we want to join the two datasets (energy data, geometry). Such a join rows of the two datasets are removed, which do not have a common column (the K for statistics) bfs_nr_municipality, which is included in both datasets.

```python
# Inner Join of municipalities geo data with energy data from 2020
# Inner Join means: we only keep rows that have the same number in bfs_nr_gemeinde and discard anything else.
# meaning: we remove any row in the huge dataset that is not in the set of Thurgau towns.
import pandas as pd
joined = pd.merge(municipalities, only2020, how="inner", on="bfs_nr_gemeinde")
joined.head()
```

### Display

Finally, we use geopandas to display the data on a map. The generated plot could, for example, be used in a paper, poster or presentation.
could be used.

```python
import geopandas as gpd
import matplotlib.pyplot as plt

# Set up pyplot
fig, ax = plt.subplots()

# Plot geometry and color by column 'einwohner'
joined.plot("einwohner", ax=ax)

# Show!
plt.show()
```

![Screenshot 2023-03-17 at 17.12.53.png](Hackathon%20Thurgau%202023%202baebb450fff483bbf04b5bd729dd7ce/Screenshot_2023-03-17_at_17.12.53.png)

### Interactive overlay with OpenStreetMap

If we want an interactive map, we use geopandas. explore to create a folium 0 or save it to an HTML file.

```python
# Generate folium map overlay over OSM and show in notebook.
map = joined.explore("einwohner")
map
```

```python
# Alternative: Save as standalone HTML page...
filename = "../output/energie.html"
map.save(filename)

# ... and open a browser on that page.
import webbrowser, os
webbrowser.open('file://' + os.path.realpath(filename))
```

## Folium

```
import folium
map = folium.Map(location=[100, 0], zoom_start=1.5)
chloropleth = folium.Choropleth(geo_data=joined,data_to_plot=joined,
             columns=['bfs_nr_gemeinde', 'total'],
             key_on='bfs_nr_gemeinde',
             fill_color='YlGnBu', fill_opacity=0.7, line_opacity=0.2,
             legend_name="Foo")
chloropleth.add_to(map)

# Create Folium plot
map.save('plot_data.html')
# Import the Folium interactive html file
from IPython.display import IFrame

IFrame('plot_data.html', width=700, height=450)
```

## Geocoding

Geocoding is finding out what location (i.e., coordinates) belong to a location.

Example: I have a piece of text and want to find out what its coordinates could be.

- Locality: Romanshorn
- Location: Kreis 4, Zurich
- Address: Bundesplatz 1, 3000 Bern
- Store: Melectronics, Amriville

Often the text can be ambiguous, then geocoding must assign the most likely coordinates. Depending on the context can help:

- Moscow probably means the capital of Russia from a planetary perspective: [https://www.openstreetmap.org/search?query=Moskau](https://www.openstreetmap.org/search?query=Moskau)
- Moscow, if I have already zoomed in on the canton of Schaffhausen on the map, probably means a village north of the Rhine: [https://www.openstreetmap.org/node/3649482118](https://www.openstreetmap.org/node/3649482118)

Below we use a geocoding service on the net to geocode some data.

```python
import pandas as pd

source = 'https://data.tg.ch/api/explore/v2.1/catalog/datasets/div-energie-10/exports/csv'

# CSV-Daten mit Pandas lesen.
# Achtung: wir verwenden Semikolons statt Kommas als Trennzeichen.
# header=0 teilt der Funktion mit, dass wir Spaltenheader in der Datei erwarten.
energy_dataset = pd.read_table(source, sep=';', header=0)
# Wie sehen die Daten aus?
energy_dataset
```

Aha, the municipality names are in the municipality_name column.

```python
import geopandas, geopandas.tools.geocoding

# Geocode the `gemeinde_name` field
gemeinde_locations = geopandas.tools.geocode(energy_dataset.gemeinde_name)
```

```python
import pandas as pd
import geopandas as gpd

# Concatenate the geocoding information along axis 1 (add columns)
geocoded = pd.concat([energy_dataset, gemeinde_locations], axis=1)
geocoded = gpd.GeoDataFrame(geocoded)
geocoded
```

### Display

Simple display of the points in pyplot.

```python
import geopandas as gpd

geocoded.explore()
```

Aha, seems like the geocoding failed fir a few places - they are drawn far from the shot:

- Cheek - Pasir Wangi, Indonesia
- Horn - Big Horn, Montana, USA

## Geodata Hacks

### **Massage Swisstopo Boundary Data**

data/towns.gejson contains the polygons for Swiss admin entities such as Gemeinde, Bezirk, Kanton etc, but we need to massage the dataset a bit to be compatible with the TG datasets.

### Steps 1: Import the data and have a look

```python
import geopandas
municipalities = geopandas.read_file("../data/towns.geojson")
municipalities
```

Ok, so we've read the swisstopo database, but there are many fields we don't want. Let's clean up:

```python
import pandas as pd

# Fix up municipalities by parsing the bfs_nr from the gml_id and converting it
# to int64.

# 1: create a series where we extract the integer number from the 'AdministrativeUnit_XY_1234' 
# string in gml_id, where 'XY' is one of 'Gemeinde', 'Bezirk', 'Kanton'.
bfs_nrs = municipalities['gml_id'].str.extract(r"(\d+)")
# Add the series to the dataset after converting it to numeric.
municipalities['bfs_nr_gemeinde'] = pd.to_numeric(bfs_nrs[0])

# Let's only retain what we need: BFS nr, geometry, type, country
municipalities = municipalities[['bfs_nr_gemeinde', 'nationalCode', 'LocalisedCharacterString', 'text', 'geometry']]

# There are four rows without BFS number
missing_number = municipalities[municipalities['bfs_nr_gemeinde'].isna()]
print(missing_number)
# Ah, the country-level entries miss the number - let's drop these:
municipalities = municipalities.dropna(subset='bfs_nr_gemeinde')

# Now we can cast the BFS nr to int64 to make it compatible with the TG energy dataset.
municipalities['bfs_nr_gemeinde'] = municipalities['bfs_nr_gemeinde'].astype('int64')

# Finally, rename the columns to be more descriptive
municipalities = municipalities.rename(columns={'nationalCode' : 'country', 'LocalisedCharacterString': 'type', 'text' : 'name'})

municipalities
```

### Save

Re-export the reduced dataset:

```python
municipalities.to_file('../data/towns_fixed.geojson', *driver*='GeoJSON')
```

### Display

Show geometries with pyplot.

```python
import geopandas as gpd
import matplotlib.pyplot as plt

# Set up pyplot
fig, ax = plt.subplots()

# Draw cantons in blue
kantone = municipalities[municipalities['type'] == 'Kanton']
kantone.plot(ax=ax, color='blue')

# Overlay with towns in red
gemeinden = municipalities[municipalities['type'] == 'Gemeinde']
gemeinden.plot(ax=ax, color = 'red')

# Show!
plt.show()
```

![Screenshot 2023-03-17 at 17.38.51.png](Hackathon%20Thurgau%202023%202baebb450fff483bbf04b5bd729dd7ce/Screenshot_2023-03-17_at_17.38.51.png)

Alternative with geopandas explore:

```python
kantone.explore()
```

# Notes 📝

Challenge

Energy check: How is your community doing?

What's at stake?

Energy, energy and more energy. It's hard to avoid this topic, whether it's the climate issue or the scenarios of an energy crisis. But what is the situation actually like on your doorstep? Which community could suffer most from an impending energy shortage? Where is the most energy consumed and who is at the forefront of renewable energy? These and other questions will be answered in our Challenge.

The Challenge

Thurgau's municipalities regularly provide data on energy production and consumption. However, it is relatively difficult for the layman to draw any conclusions from dry tables. This challenge is therefore about visualizing the available data in an original way. The goal should be that every citizen is able to recognize where his or her own community stands in comparison to the rest of Thurgau. Various factors from the field of energy are to be included, supplemented by other indicators of the municipality. You can give free rein to your creativity in the visualization and also in how broadly you would like to grasp the energy topic.

What do we provide you with?

We at the OGD Coordination Office of the Canton of Thurgau provide various energy-related data via our data catalog and show you where you can find further data and information (see files above and descriptions below). If you have comprehension questions about the data itself or need support with visualization or data analysis, we are happy to provide advice and assistance - on-site, via github or Slack.

Want a few hints & tricks?

The KSR Talent team has put together a small tutorial on visualization and working with (geo)pandas here. The repo also contains a collection of the geometries of the Swiss municipalities and cantons...

---

Data

Energy data

On our data portal data.tg.ch you can find several datasets about energy, which are collected by the Office of Energy. All data can be downloaded as csv, xlsx or JSON:

Final energy consumption in the building sector by energy source and municipality.

Renewable electricity production by energy source and municipality

CO2 emissions in the building sector by energy source and municipality

Energy promotion program in the canton of Thurgau: Implemented projects in the Thurgau municipalities

Note on data status: data on energy consumption, electricity production as well as emissions range from 2015 to 2020 and should soon be supplemented with data from 2021. Format and structure remain the same, so that your tool can display the current data analogously to the previous ones as soon as they are available.

You can find more energy data on data.tg.ch or on the federal OGD portal opendata.swiss (not all data here refers to Thurgau).

---

Energy Reporter and Solar Potential - Energy Future in the Communities

The Energy Reporter of Energy Switzerland collects different data around the topic of energy future. We have compiled the data sets filtered by the Thurgau municipalities for you here on github. The corresponding folder Energy Reporter contains the following datasets in csv format:

energyreporter_municipality.csv

The energy reporter shows the developments of the energy transition in the municipalities of Thurgau. The dataset shows the current progress in the selected areas of electric cars, production of solar power and renewable heating for each municipality.

The current dataset with the extension _latest contains the current progress of all municipalities in Thurgau in csv format.

The historized dataset with the suffix _historized contains monthly time slices since the beginning of the data collection by the Energy Reporter (March 1, 2021) with the progress of all municipalities in csv format.

You can view the meaning of each indicator on the Energy Reporter page. Just click on the corresponding indicators in the graphic on the page to get information about the exact content and calculation.

Below you will also find a description of the variables in the dataset.

Description attributes

[Translated with DeepL](https://www.deepl.com/translator?utm_source=macos&utm_medium=app&utm_campaign=macos-share)