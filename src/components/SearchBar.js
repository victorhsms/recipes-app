import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  fetchMealByIngredients,
  fetchMealByName,
  fetchMealByFirstLetter,
} from '../services/fetchMeals';
import {
  fetchDrinkByIngredients,
  fetchDrinkByName,
  fetchDrinkByFirstLetter,
} from '../services/fetchDrinks';
import RecipesContext from '../context/RecipesContext';

function SearchBar({ history, location }) {
  const [formClass, setFormClass] = useState('search-form-hidden');
  const [searchValue, setSearchValue] = useState('');
  const [radioSearch, setRadioSearch] = useState('');
  const { setSearchResults } = useContext(RecipesContext);

  useEffect(() => {
    setFormClass('search-form-shown');

    return () => setFormClass('search-form-hidden');
  }, []);

  const saveRecipes = async (recipes, type) => {
    if (recipes.length === 1) {
      if (type === 'meals') {
        history.push(`/foods/${recipes[0].idMeal}`);
      } else {
        history.push(`/drinks/${recipes[0].idDrink}`);
      }
    } else {
      setSearchResults(recipes);
      setSearchValue('');
    }
  };

  const getRecipes = async (type, fetchRecipes) => {
    const recipes = await fetchRecipes(searchValue);
    if (recipes === null) {
      return global.alert('Sorry, we haven\'t found any recipes for these filters.');
    }
    if (recipes) {
      const MAX_RECIPES = 12;
      saveRecipes(recipes.slice(0, MAX_RECIPES), type);
    }
  };

  const searchController = (event) => {
    event.preventDefault();

    const FIRST_LETTER = 'first-letter';

    if (radioSearch === FIRST_LETTER && searchValue.length >= 2) {
      return global.alert('Your search must have only 1 (one) character');
    }

    if (location.includes('foods')) {
      if (radioSearch === 'ingredient') getRecipes('meals', fetchMealByIngredients);
      if (radioSearch === 'name') getRecipes('meals', fetchMealByName);
      if (radioSearch === FIRST_LETTER) getRecipes('meals', fetchMealByFirstLetter);
      return;
    }
    if (radioSearch === 'ingredient') getRecipes('drinks', fetchDrinkByIngredients);
    if (radioSearch === 'name') getRecipes('drinks', fetchDrinkByName);
    if (radioSearch === FIRST_LETTER) getRecipes('drinks', fetchDrinkByFirstLetter);
  };

  return (
    <form className={ formClass }>
      <div className="search-inputs">
        <div>
          <input
            type="text"
            data-testid="search-input"
            placeholder="Search Recipe"
            value={ searchValue }
            onChange={ ({ target }) => setSearchValue(target.value) }
          />
          <button
            type="submit"
            data-testid="exec-search-btn"
            onClick={ searchController }
          >
            Search
          </button>
        </div>

        <div className="radio-container">
          <label className="radio-buttons" htmlFor="ingredient-radio">
            <input
              data-testid="ingredient-search-radio"
              id="ingredient-radio"
              type="radio"
              name="search-radio"
              onChange={ () => setRadioSearch('ingredient') }
            />
            {' '}
            Ingredient
          </label>
          <label className="radio-buttons" htmlFor="name-radio">
            <input
              data-testid="name-search-radio"
              id="name-radio"
              type="radio"
              name="search-radio"
              onChange={ () => setRadioSearch('name') }
            />
            {' '}
            Name
          </label>
          <label className="radio-buttons" htmlFor="first-letter-radio">
            <input
              data-testid="first-letter-search-radio"
              id="first-letter-radio"
              type="radio"
              name="search-radio"
              onChange={ () => setRadioSearch('first-letter') }
            />
            {' '}
            First Letter
          </label>
        </div>
      </div>
    </form>
  );
}

SearchBar.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  location: PropTypes.string.isRequired,
};

export default SearchBar;
