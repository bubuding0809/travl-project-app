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

-- # Get the flight tickets information for flights in 2022 December that the user AMRI with an id of "cl92lvec40000obt1t62zu8ca" has bought.
SELECT Ao.iata, Ao.airportName, Ad.iata, Ad.airportName, F.priceUSD, P.firstName, P.lastName, P.age, P.passportNo, F.departDateTime, F.arriveDateTime
FROM Airport Ao, Airport Ad, Flight F, Passenger P, Ticket_buy TB, User U
WHERE F.originAirport = Ao.icao AND F.destAirport = Ad.icao
	  AND TB.uid = U.id AND TB.fid = F.fid AND TB.pid = P.pid 
	  AND U.id = 'cl92lvec40000obt1t62zu8ca' AND DATE_FORMAT(F.departDateTime, '%Y-%m') = '2022-12'
ORDER BY F.departDateTime;


SELECT DATE_FORMAT(DATE('2022-11-01'), '%Y %m');

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

SELECT Airport.icao, Airport.iata, Airport.airportName, City.cityName, Country.countryName
FROM Airport, City, Country
WHERE Airport.cid = City.cid AND City.cityName LIKE '%beijing%' AND City.alpha3 = Country.alpha3 AND Airport.iata IS NOT NULL

SELECT Passenger.lastName, Country.countryName
FROM Passenger, Nationality, Country
WHERE Passenger.pid = Nationality.pid AND Nationality.alpha3 = Country.alpha3

