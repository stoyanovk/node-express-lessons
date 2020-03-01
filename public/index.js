const table = document.getElementById("card");
const price = document.getElementById("price");

document.addEventListener("click", function(e) {
  if (!e.target.classList.contains("js-btn")) return;
  const id = e.target.getAttribute("data-id");
  const token = e.target.getAttribute("data-csurf");

  fetch(`/card/remove/${id}`, {
    method: "DELETE",
    headers: { "CSRF-Token": token }
  })
    .then(r => r.json())
    .then(r => {
      const result = r.courses.map(({ title, count, id }) => {
        return `
        <tr>
          <td>${title}</td>
          <td>${count}</td>
          <td>
              <button class="btn btn-primary js-btn" data-id="${id}">delete</button>
          </td>
        </tr>
        `;
      });

      table.innerHTML = result.join("");
      price.innerHTML = r.totalPrice;
    });
});

var instance = M.Tabs.init(document.querySelector(".tabs"));
