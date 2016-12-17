# Genepie - Visualize a .ged file

A simple tool for exploring ancestry. If you follow your ancestors back
as far as the records go, what percent German / British / whatever are
you?

The tool traverses a `.ged` file. For each person, it walks back their ancestors until reaching "roots" - ancestors without records of their parents. It guesses those ancestors' nationality (birth, residence, death, in that order), and propogates that information back up.

"Nationality" is granular at the US state level ("Pennsylvania"), or whole country ("Germany"). Very heuristic-y.

## Screenshots

![Screenshot](https://github.com/bmalehorn/genepie/raw/master/example.png)

## Usage

1. download `.ged` file. If you have an ancestry.com account, you can download this one way or another
2. open `index.html`
3. upload `.ged` file
4. click around
