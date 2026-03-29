const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const status = document.getElementById("status");
const results = document.getElementById("results");

searchBtn.addEventListener("click", runSearch);
searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") runSearch();
});

async function runSearch() {
  const term = searchInput.value.trim();

  if (!term) {
    status.textContent = "Please enter a meal name to search.";
    status.classList.remove("error");
    results.innerHTML = "";
    return;
  }

  status.textContent = "Loading...";
  status.classList.remove("error");
  results.innerHTML = "";

  try {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.meals) {
      status.textContent = `No meals found for "${term}". Try something else.`;
      return;
    }

    status.textContent = `Found ${data.meals.length} result${data.meals.length !== 1 ? "s" : ""}.`;

    results.innerHTML = data.meals.map(meal => `
      <div class="card">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="card-body">
          <h3>${meal.strMeal}</h3>
          <span class="tag">${meal.strCategory}</span>
          <span class="tag">${meal.strArea}</span>
        </div>
      </div>
    `).join("");

  } catch (error) {
    status.textContent = "Something went wrong. Please try again.";
    status.classList.add("error");
    console.error(error);
  }
}
