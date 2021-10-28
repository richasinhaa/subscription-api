# Subscription Service API

Backend system where user A can chat with user B only when user A has paid up the subscription amount which user B has fixed for anyone to chat with him/her.

Features -
1) There will be a monthly subscription which user A can buy and upon ending of subscription if no renewal is done then user A will not be able to converse with user B.
2) User A should be reminded about renewal of subscription 7,3,1,0 days before the expiry & 1,3,7 day post expiry if no renewal is done
3) User B can also offer a 1,3,7 Day trial offer for user A to chat. Trial will only be applicable once and in future no more trials can be offered by user B to user A.
4) User B can anytime give an offer on the fixed subscription price.Eq - If User B has set 1000rs for 30 days as his/her subscription charge, then on some days, he/she can give 25% discount on 1000 rs for anyone to join the subscription. The offer will have an expiry (eg. 6 hours or 1 days etc) and post expiry, fixed subscription amount will be applicable for any new purchase.
5) User B can also bundle subscriptions. Eg. 1 month subscription at 1000rs, 3 Month at 2000rs(33% discount on 3 months subscription)

## Technologies

Database - MongoDB <br/>
Backend - ExpressJS, NodeJS <br/>
Database hosted on MongoDB Atlas <br/>
System hosted on AWS 

## Installation

npm install
<br/>
npm start

## AWS Hosting 

http://ec2-18-217-213-17.us-east-2.compute.amazonaws.com:3000/

## API Documentation (Endpoints, Requests & Response)

[Subscription API Documentation](https://documenter.getpostman.com/view/11648035/UV5deF1y)

## Service Provider and Customer Workflows

![Subscription (1)](https://user-images.githubusercontent.com/45893103/139261772-f88731ea-5955-4187-85b7-87b6f3a35bd1.png)
