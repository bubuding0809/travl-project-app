# QUERY 1)
# Find all hospitals and address of the hospital within 50Km of the city named Beijing.
# cid for Beijing is '1156228865'
SET @sourceX = (SELECT longitude FROM City WHERE cid = '1156228865');
SET @sourceY = (SELECT latitude FROM City WHERE cid = '1156228865');
SET @radius = 50000;
SELECT H.hospitalName, H.address, H.phoneNo, H.longitude, H.latitude, ROUND(ST_DISTANCE_SPHERE(POINT(@sourceX, @sourceY), POINT(H.longitude, H.latitude))/1000, 2) as distance_km
FROM Hospital H
WHERE ST_DISTANCE_SPHERE(POINT(@sourceX, @sourceY), POINT(H.longitude, H.latitude)) < @radius
ORDER BY distance_km;



# QUERY 2)
# How much Thai Bhat (THB) can you convert from 100 SGD with the latest exchange rate?
# Get the entry date of as well
SELECT 100 * rate AS SGD_amount, entryDate
FROM Forex
WHERE currencyBase = 'SGD' AND currencyAgainst = 'THB'
ORDER BY entryDate DESC
LIMIT 1;



# QUERY 3)
# Which month had the highest daily average number of new Covid-19 cases in Singapore in the year 2022?
SELECT MONTHNAME(C.entryDate) AS Month, ROUND(AVG(C.newCaseNo)) AS Daily_average#, SUM(C.newCaseNo) as Monthly_Total, COUNT(*) AS Days_In_Month
FROM Covid C, Country Cn
WHERE C.alpha3=Cn.alpha3 AND Cn.countryName = 'Singapore' AND YEAR(C.entryDate) = 2022
GROUP BY Month
ORDER BY Daily_average DESC
LIMIT 1;



# QUERY 4)
# What is the earliest flight that I can take from Singapore Changi Airport to Tokyo Haneda Airport on 22nd Oct 2022?
# Flight details include departure date time, arrival date time, origin airport code , destination airport code and flight price in USD.
SELECT F.departDateTime, F.arriveDateTime, A1.iata as originIata, A2.iata as destIata, F.priceUSD
FROM Flight F, Airport A1, Airport A2
WHERE F.originAirport = A1.icao AND F.destAirport = A2.icao
      AND
      F.originAirport = 'WSSS' # Singapore Changi Airport ICAO code
      AND
      F.destAirport = 'RJTT' # Tokyo Haneda Internation Airport ICAO code
      AND DATE(F.departDateTime) = '2022-10-22'
ORDER BY F.departDateTime
LIMIT 1;



# QUERY 5)
# Get the ticket information of flights tickets that the user "bubuding" has bought, for flights in the month of Nov 2022
# Ticket information should include:
# origin airport name, destination airport name, passenger first and last name, price of flight in USD, seat number, class, flight id, depart and arrive date time.
SELECT Ao.iata, Ao.airportName, Ad.iata, Ad.airportName, F.priceUSD, P.firstName, P.lastName, P.age, P.passportNo, F.departDateTime, F.arriveDateTime
FROM Airport Ao, Airport Ad, Flight F, Passenger P, Ticket_buy TB, User U
WHERE F.originAirport = Ao.icao AND F.destAirport = Ad.icao
	  AND
      TB.uid = U.id AND TB.fid = F.fid AND TB.pid = P.pid
	  AND
      U.id = 'cl92lvec40000obt1t62zu8ca' AND DATE_FORMAT(F.departDateTime, '%Y-%m') = '2022-11'
ORDER BY F.departDateTime;