# Exploratory Data Analysis (EDA) Report  
## CrimeIntel AI – Social Intelligence & Crime Monitoring Platform

---

## 1. Introduction

CrimeIntel AI is a social intelligence platform designed to monitor, aggregate, and analyze crime-related news from multiple digital news platforms.  
This Exploratory Data Analysis (EDA) focuses on extracting insights from aggregated crime-related news data to understand reporting patterns, source reliability, and content trends for **Nagpur, Maharashtra**.

---

## 2. Objectives of EDA

- Analyze distribution of news across sources  
- Identify crime categories and reporting patterns  
- Evaluate source credibility and reliability  
- Detect temporal trends in crime reporting  
- Generate insights for dashboard design and analytics  

---

## 3. Role of EDA in CrimeIntel AI

The insights derived from EDA directly influence the design and functionality of the CrimeIntel AI dashboard:

- Crime categories used for filtering and visualization  
- Source credibility used for ranking and prioritization  
- Temporal trends used for analytics and charting  
- Data preprocessing logic directly influences backend ingestion and normalization pipelines  

---

## 4. Dataset Description

### 4.1 Data Collection

- **Method**: Web scraping using Node.js, Axios, Cheerio, and Puppeteer
- **Storage**: MongoDB
- **Export Format**: JSON
- **Analysis Tool**: Python (Pandas, Matplotlib, Seaborn)

### 4.2 Data Sources

The dataset contains crime-related news articles collected from multiple trusted platforms:

- LiveNagpur  
- Nagpur Today  
- Lokmat  
- Maharashtra Times  
- Sakal (eSakal)  
- Times of India  
- NewsData.io  

### 4.3 Key Fields in Dataset

| Column Name | Description |
|------------|------------|
| source | News website source |
| text | Headline of the news |
| fullText | Detailed description (if available) |
| category | Type of crime |
| scrapedAt | Date of publication |
| city | City name |
| state | State name |
| credibility | Source credibility level |
| credibilityScore | Numeric credibility score |
| fingerprint | Unique identifier for deduplication |

---

## 5. Data Preprocessing

The following preprocessing steps were performed:

- Removal of duplicate articles using fingerprint hashing
- Filtering only Nagpur-related articles
- Normalization of text fields
- Categorization of crime types using keyword matching
- Validation of trusted sources
- Handling missing images and metadata

---

## 6. Exploratory Data Analysis

### 6.1 Source-wise News Distribution

This analysis shows how many crime-related articles were published by each source.

**Insight:**
- Local news platforms such as LiveNagpur and Sakal contribute the majority of articles
- National sources provide fewer but more detailed reports

*(Graph: Bar chart – Articles per Source)*

---

### 6.2 Crime Category Distribution

Articles were classified into crime categories such as:

- Murder
- Robbery
- Accident
- Sexual Offence
- Kidnapping
- Narcotics
- Other

**Insight:**
- Robbery and murder-related incidents are the most frequently reported
- Narcotics-related crimes appear less frequently in news coverage

*(Graph: Pie chart / Bar chart – Crime Categories)*

---

### 6.3 Credibility Analysis

Each article was assigned a credibility score based on:
- Source domain trust level
- Availability of media (images)

**Insight:**
- Majority of articles fall under **medium to high credibility**
- Low credibility articles are minimal due to trusted-source filtering

*(Graph: Bar chart – Credibility Levels)*

---

### 6.4 Time Series Analysis

Crime news frequency was analyzed over time to observe reporting trends.

**Insight:**
- Sudden spikes in reporting correspond to major crime incidents
- Consistent reporting frequency indicates stable data collection

*(Graph: Line chart – Articles over Time)*

---

## 7. Key Findings

- Local news platforms contribute the majority of crime-related reporting  
- Violent crimes such as robbery and murder are the most frequently reported categories  
- Source filtering significantly improves data reliability and consistency  
- Structured preprocessing enables effective transformation of unstructured news data into usable insights  

---

## 8. Conclusion

The EDA process validates the effectiveness of CrimeIntel AI in aggregating and structuring crime-related news data.  
It demonstrates how raw, unstructured information can be transformed into meaningful insights that support real-time monitoring and analytical dashboards.

This analysis forms the foundation for building scalable intelligence systems.

---

## 9. Future Scope

- Predictive crime analysis using Machine Learning
- Sentiment analysis of crime-related news
- Geographic crime heatmaps
- Real-time dashboards for law enforcement and researchers

---

## 10. Tools & Technologies Used

- **Backend**: Node.js, Express, Puppeteer, Axios
- **Database**: MongoDB
- **Analysis**: Python, Pandas, Matplotlib, Seaborn
- **Documentation**: Markdown

---

## 11. Acknowledgement

This project was built to explore practical applications of data ingestion, analysis, and real-time visualization in modern intelligence systems.
