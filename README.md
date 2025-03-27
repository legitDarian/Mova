<p align="center">
    <img alt="Mova" src="https://github.com/legitDarian/Mova/blob/24c419634ee9e3231784be39a7def004af3f28bc/hax.png?raw=true">
</p>

## What is Mova?
Mova is a utility for pointing out the common issues with i-Ready.

## Features
- Lesson Skipper: Allows you to instantly skip through an entire lesson with a custom score.
- Minute Farmer: Allows you to obtain minutes without actually having to actively do the lesson.

## How to use Mova?
1. Download the latest Mova release from [here](https://github.com/legitDarian/Mova/releases).
2. Create a new bookmark.
3. Open the Mova bundle (the file that you just downloaded) in a text editor and copy all of it's contents.
4. In the URL field, paste in the code that you just copied.
5. Save the bookmark.
6. Visit i-Ready and click the bookmark and the Mova UI should appear.

**Note: If the bookmark bar is not showing, press Ctrl + Shift + B.**

## Build Instructions

### Dependencies
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Build
1. Clone the repository:
```
git clone https://github.com/legitDarian/Mova.git
cd Mova
```

2. Install dependencies:
```
npm install
```

3. Build the project:
```
npm run build
```
Once the build process finishes, the bundled Mova JS file will be at `dist/MovaReady.bundle.js`
