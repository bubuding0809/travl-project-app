# Hospital
SELECT H.hospitalName, C1.cityName, H.address, C2.countryName
FROM Hospital H, City C1, Country C2
WHERE H.cid = C1.cid AND C1.alpha3=C2.alpha3 AND C1.cityName LIKE 'Beijing';

# City - find cities with the name springfield that is located in a country called United States
SELECT *
FROM City C1, Country C2
WHERE C1.alpha3=C2.alpha3 AND C1.cityName = 'Springfield' AND C2.countryName LIKE '%United States%';

# City - find the city that is the primary capital of a country called North Korea
SELECT *
FROM City C1, Country C2
WHERE C1.alpha3=C2.alpha3 AND C2.alpha3='PRK' AND C1.capital='primary';

# Country - find country with country name of Singapore
SELECT * 
FROM Country
WHERE Country.countryName LIKE 'Singapore';

# Airport - find cities that have more that than 1 airport
SELECT C2.countryName, C1.cityName, COUNT(DISTINCT A.icao)
FROM Airport A, City C1, Country C2
WHERE A.cid=C1.cid AND C1.alpha3=C2.alpha3
GROUP BY C2.alpha3, C1.cid
HAVING COUNT(DISTINCT A.icao) > 1;

# Airport - find airports at city of Johannesburg in South Africa
SELECT A.icao, A.airportName, A.timezone
FROM Airport A, City C1, Country C2
WHERE A.cid=C1.cid AND C1.alpha3=C2.alpha3 AND C2.countryName='South Africa' AND C1.cityName='Johannesburg';

# Covid - get daily new covid cases in china from 2022-10-01 to 2022-11-01
SELECT C.countryName, newCaseNo, Cvd.entryDate
FROM Covid Cvd, Country C
WHERE Cvd.alpha3 = C.alpha3 AND C.countryName='China' AND Cvd.entryDate BETWEEN '2022-08-01' AND '2022-09-01';

# Covid - get total entries for each country in europe
SELECT Country.countryName, COUNT(*) 
FROM Covid, Country
WHERE Covid.alpha3=Country.alpha3 AND Country.region='Europe'
GROUP BY Covid.alpha3;

# Covid - get total number of new cases in China in the month of May 2022
SELECT SUM(Covid.newCaseNo)
FROM Covid, Country
WHERE Covid.alpha3=Country.alpha3 AND Country.countryName='China' AND Covid.entryDate BETWEEN '2022-05-01' AND '2022-06-01';

# Covid - get the country name with the most new deaths for the month of May in 2022
SELECT Country.countryName, SUM(Covid.newDeathNo) as monthlyDeaths
FROM Covid, Country
WHERE Covid.alpha3=Country.alpha3 AND Covid.entryDate BETWEEN '2022-05-01' AND '2022-06-01'
GROUP BY Country.alpha3
ORDER BY monthlyDeaths DESC
LIMIT 1;

# Currency - get countries that use the Euro
SELECT Country.countryName, Currency.isoCode
FROM Country, Currency
WHERE Country.isoCode=Currency.isoCode AND Currency.currencyName='Euro';

# Forex - get the date with the best exchange rate for someone who wants to travel from singapore to Beijing from 2022 Jun to 2022 Aug
SELECT F.entryDate, F.rate
FROM Forex F
WHERE (F.currencyBase, F.currencyAgainst) IN (SELECT Co1.isoCode, Co2.isoCode
												FROM Country Co1, Country Co2, City Ci1, City Ci2
												WHERE Co1.alpha3 = Ci1.alpha3 AND Co2.alpha3 = Ci2.alpha3 AND Ci1.cityName LIKE 'Singapore' AND Ci2.cityName LIKE 'Beijing') AND MONTH(F.entryDate) BETWEEN 6 AND 7
ORDER BY F.rate DESC
LIMIT 1;

# -----------------------------------------------------------------------------------------------------------------

-- # Find all hospitals and address of the hospital within 50Km of the city named Beijing.
SET @sourceX = (SELECT longitude FROM City WHERE cid = '1156228865');
SET @sourceY = (SELECT latitude FROM City WHERE cid = '1156228865');
SET @radius = 10000;
SELECT *, ROUND(ST_DISTANCE_SPHERE(POINT(@sourceX, @sourceY), POINT(H.longitude, H.latitude))/1000, 2) as distance_km
FROM Hospital H
WHERE ST_DISTANCE_SPHERE(POINT(@sourceX, @sourceY), POINT(H.longitude, H.latitude)) < @radius
ORDER BY distance_km;

-- # What is the average amount of Thai Bhat I can get for $100 of SGD in January of 2022?
SELECT ROUND(100*AVG(rate)) AS THB, AVG(rate) AS avg_rate
FROM Forex 
WHERE currencyBase = 'SGD' AND currencyAgainst = 'THB' AND DATE_FORMAT(Forex.entryDate, '%Y-%m') = '2022-01';

-- # Which month had the highest average number of new Covid-19 cases in Singapore in the year 2022?
SELECT MONTHNAME(C.entryDate) AS Month, ROUND(AVG(C.newCaseNo)) AS Average_Cases
FROM Covid C, Country Cn 
WHERE Cn.countryName = 'Singapore' AND C.alpha3=Cn.alpha3 AND YEAR(C.entryDate) = 2022
GROUP BY Month 
ORDER BY Average_Cases DESC;

-- # What is the earliest flight that I can take from Changi Airport to a city called Tokyo on the 2nd Oct 2022?
SELECT A2.airportName as Destination_Airport, F.departDateTime, F.arriveDateTime
FROM Flight F, Airport A1, Airport A2
WHERE F.originAirport = A1.icao AND F.destAirport = A2.icao 
						AND
	  F.originAirport = (SELECT A.icao AS destination
						FROM Airport A, City C
						WHERE A.cid = C.cid AND C.cityName LIKE '%Singapore%' AND A.airportName LIKE '%Changi airport%')
                        AND
	  F.destAirport IN (SELECT A.icao AS destination
						FROM Airport A, City C
						WHERE A.cid = C.cid AND C.cityName LIKE '%Tokyo%')
                        AND
						DATE(F.departDateTime) = '2022-10-02'
ORDER BY F.departDateTime;

-- # Get the origin airport name, destination airport name and price of the flight tickets that a user with username of “Amri99” has bought during Oct 2022.
SELECT Aorigin.airportName, Adest.airportName, F.priceUSD, P.firstName, P.lastName
FROM Airport Aorigin, Airport Adest, Flight F, Passenger P, Ticket_buy TB, User U
WHERE F.originAirport = Aorigin.icao AND F.destAirport = Adest.icao 
	  AND TB.uid = U.id AND TB.fid = F.fid AND TB.pid = P.pid 
	  AND U.name = 'Amri99' AND DATE_FORMAT(TB.createdAt, '%Y-%m') = '2022-10';

SELECT *
FROM (SELECT * FROM Airport WHERE cid = '1156228865'
        UNION DISTINCT
        SELECT * FROM Airport
        ORDER BY ST_Distance_Sphere(
        POINT(longitude, latitude),
        POINT((SELECT C1.longitude FROM City C1 WHERE cid = '1156228865'), (SELECT C2.latitude FROM City C2 Where cid = '1156228865'))
    )
LIMIT 3) as NearByAirports
WHERE iata IS NOT NULL
LIMIT 10;