export const frontEndURL = 'http://localhost:5173';
export const backEndURL = 'http://localhost:3000';

const date = new Date()
export const formattedDate = date.toLocaleDateString('en-US', {
weekday: 'long',
month: 'long',
day: 'numeric',
year: 'numeric',
});

