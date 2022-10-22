CREATE TABLE Country (
	alpha3 VARCHAR(3),
    alpha2 VARCHAR(2) NOT NULL UNIQUE,
	countryName VARCHAR(50) NOT NULL,
    ccode INT NOT NULL UNIQUE,
    region VARCHAR(20),
    isoCode VARCHAR(3) NOT NULL,
    PRIMARY KEY (alpha3),
    FOREIGN KEY (isoCode) REFERENCES Currency(isoCode) ON DELETE NO ACTION
);

CREATE TABLE City (
	cid VARCHAR(15),
    cityName VARCHAR(50) NOT NULL,
    adminName VARCHAR(50) DEFAULT NULL,
    population INT DEFAULT NULL,
    latitude FLOAT DEFAULT NULL,
    longtitude FLOAT DEFAULT NULL,
    capital VARCHAR(20) DEFAULT NULL,
    alpha3 VARCHAR(3) NOT NULL,
	PRIMARY KEY (cid),
    FOREIGN KEY (alpha3) REFERENCES Country(alpha3)
);

CREATE TABLE Hospital_Temp (
	hid INT AUTO_INCREMENT,
	hospitalName VARCHAR(50),
    address VARCHAR(100),
    phoneNo VARCHAR(50),
    latitude FLOAT NULL,
    longitude FLOAT NULL,
    cid VARCHAR(20) NOT NULL,
    PRIMARY KEY (hid),
    FOREIGN KEY (cid) REFERENCES City(cid) ON DELETE NO ACTION
);

CREATE TABLE Airport (
	icao VARCHAR(4),
    iata VARCHAR(3) NULL,
    airportName VARCHAR(50) NOT NULL,
    latitude FLOAT DEFAULT NULL,
    longitutde FLOAT DEFAULT NULL,
    timezone FLOAT DEFAULT NULL,
    cid VARCHAR(20) NOT NULL,
    PRIMARY KEY (icao),
    FOREIGN KEY (cid) REFERENCES City(cid)
);

CREATE TABLE Covid (
	id INT AUTO_INCREMENT,
    entryDate DATE NOT NULL,
    totalCaseNo INT NULL,
    newCaseNo INT NULL,
    totalDeathNo INT NULL,
    newDeathNo INT NULL,
    alpha3 VARCHAR(3) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (alpha3) REFERENCES Country(alpha3)
);

CREATE TABLE Currency (
	isoCode VARCHAR(3),
    currencyName VARCHAR(50),
    PRIMARY KEY (isoCode)
);

CREATE TABLE Forex (
	tid INT AUTO_INCREMENT,
    entryDate DATE NOT NULL,
    rate FLOAT NOT NULL,
    currencyBase VARCHAR(3) NOT NULL,
    currencyAgainst VARCHAR(3) NOT NULL,
    PRIMARY KEY (tid),
    FOREIGN KEY (currencyBase) REFERENCES Currency(isoCode),
    FOREIGN KEY (currencyAgainst) REFERENCES Currency(isoCode),
    CONSTRAINT CHECK(currencyBase <> currencyAgainst)
);

CREATE TABLE Flight (
	fid INT AUTO_INCREMENT,
    arriveDateTime DATETIME NOT NULL,
    departDateTIME DATETIME NOT NULL,
    priceUSD FLOAT NOT NULL,
    originAirport VARCHAR(4),
    destAirport VARCHAR(4),
    PRIMARY KEY (fid),
    FOREIGN KEY (originAirport) REFERENCES Airport(icao),
    FOREIGN KEY (destAirport) REFERENCES Airport(icao)
);

CREATE TABLE Passenger (
	pid VARCHAR(40) DEFAULT(uuid()),
    firstName VARCHAR(20),
    lastName VARCHAR(20),
    passportNo VARCHAR(30) NOT NULL UNIQUE,
    age INT,
    PRIMARY KEY (pid)
);

CREATE TABLE Nationality (
	pid VARCHAR(40),
    alpha3 VARCHAR(3),
    PRIMARY KEY (pid, alpha3),
    FOREIGN KEY (pid) REFERENCES Passenger(pid),
    FOREIGN KEY (alpha3) REFERENCES Country(alpha3)
);

CREATE TABLE Flies_with (
	pid VARCHAR(40),
    fid INT,
    PRIMARY KEY(pid, fid),  
    FOREIGN KEY (pid) REFERENCES Passenger(pid),
    FOREIGN KEY (fid) REFERENCES Flight(fid)
);

CREATE TABLE Ticket_buy (
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    uid VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    fid INT,
    pid VARCHAR(40),
    seatNo varchar(5) NULL,
    class enum ('Economy', 'Business', 'First') NULL,
    PRIMARY KEY (uid, fid, pid),
    FOREIGN KEY (uid) REFERENCES User(id) ON DELETE NO ACTION,
    FOREIGN KEY (fid) REFERENCES Flight(fid),
    FOREIGN KEY (pid) REFERENCES Passenger(pid)
);

CREATE TABLE Post (
	postid INT AUTO_INCREMENT,
	createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    title VARCHAR(191) NOT NULL,
    content VARCHAR(1000) NOT NULL,
    author VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL, 
    city VARCHAR(15),
    PRIMARY KEY(postid),
    FOREIGN KEY(author) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY(city) REFERENCES City(cid)
);

# How to load large csv file into database
LOAD DATA LOCAL INFILE '/Users/dingruoqian/Desktop/TLM2004_Database/project-data/cleaned-hospitals.csv'
INTO TABLE Hospital_Temp
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(Hospital_Temp.hospitalName, Hospital_Temp.address, Hospital_Temp.phoneNo, Hospital_Temp.latitude, Hospital_Temp.longitude, Hospital_Temp.cid);

