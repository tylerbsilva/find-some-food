# Rent-A-Car

A simple React/Redux implementation of a rental car search built off of the Hotline API. This was for a coding test for a company.

## Running

First `npm install` to grab all the necessary dependencies.

Then run `npm start` and open <localhost:7770> in your browser.

Or visit [https://ts-rent-a-car.herokuapp.com/](https://ts-rent-a-car.herokuapp.com/) to view the live version.

## Implementation

I decided to go with a React/Redux setup because lately that is what I have been learning about and a unidirectional data-flow was best suited. The user would create a search and the server would provide the data back, so two-way data binding was not necessary.

For the styling, a clean, modern approach was what I was going for. My styles are based off of Google Material Design.

## Issues

I ran into a few issues regarding making calls to the Hotline API. At first, I deployed the application on Surge.sh which is a fast solution for backend-less applications. I quickly realized that in order to allow for CORS request, you had to purchase their monthly plan. I then created a solution where I made a middle-man API that increased the call time a tiny bit, but allowed me to make the request without having to change my HEADERS.


## Next Steps

After limiting myself to 8 hours, I composed a list of what I would do to further my project:
- [ ] Clean up styles even more
- [ ] Give the site more of a "brand"
- [ ] Allow user to filter by Car type via search
- [ ] Have a better setup for mobile, as right now the collapsing works but isn't great
- [ ] Add even more filtering capabilities once the data comes back from Hotline (Price high/low, features, seats)
