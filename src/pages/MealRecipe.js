import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { fetchMealById } from '../services/fetchMeals';
import embedYoutubeUrl from '../helpers/toEmbedYoutube';
import { fetchDrinks } from '../services/fetchDrinks';
import RecomendCarousel from '../components/RecomendCarousel';
import StartRecipeBtn from '../components/StartRecipeBtn';
import FavoriteBtn from '../components/FavoriteBtn';
import ShareBtn from '../components/ShareBtn';

function MealRecipe({ match: { params: { id } } }) {
  const [recipe, setRecipe] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [recomendations, setRecomendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getRecipe = async () => {
      const recomendationsReq = await fetchDrinks();
      const MAX_CAROUSEL_RECOM = 6;
      setRecomendations(recomendationsReq.slice(0, MAX_CAROUSEL_RECOM));
      const responseRecipe = await fetchMealById(id);
      if (responseRecipe) {
        setYoutubeUrl(embedYoutubeUrl(responseRecipe.strYoutube));

        setRecipe(responseRecipe);

        const recipeIngredients = Object.entries(responseRecipe)
          .filter((entry) => entry[0].includes('strIngredient') && entry[1] !== (''))
          .map((entry) => entry[1]);
        setIngredients(recipeIngredients);
      }
      setIsLoading(false);
    };
    getRecipe();
  }, [id]);

  const objToCarousel = recomendations.map((drink) => ({
    id: drink.idDrink,
    name: drink.strDrink,
    imgUrl: drink.strDrinkThumb,
    category: drink.strCategory,
  }));

  return (
    <main>
      {!isLoading && (
        <>
          <img
            className="mw-100"
            src={ recipe.strMealThumb }
            data-testid="recipe-photo"
            alt="imagem da receita"
          />

          <h1 data-testid="recipe-title">{recipe.strMeal}</h1>
          <p data-testid="recipe-category">{recipe.strCategory}</p>

          <ShareBtn type="foods" id={ recipe.idMeal || '' } />

          <FavoriteBtn />

          <div>
            <h3>Ingredients</h3>
            <ul>
              {ingredients.map((ingredient, index) => (
                <li
                  key={ index }
                  data-testid={ `${index}-ingredient-name-and-measure` }
                >
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Instructions</h3>
            <p data-testid="instructions">{recipe.strInstructions}</p>
          </div>

          <div>
            <h3>Video</h3>
            <iframe
              data-testid="video"
              width="340"
              height="315"
              src={ youtubeUrl }
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture"
              allowFullScreen
            />
          </div>

          <RecomendCarousel recomendations={ objToCarousel } loading={ isLoading } />

          <StartRecipeBtn />
        </>)}
    </main>
  );
}

MealRecipe.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default MealRecipe;
