/* variables */
const inputEl = document.getElementById(`input`);
const buttonEl = document.getElementById(`get-repos`);
const reposEl = document.getElementById(`show-repos`);
const UserInfoEl = document.getElementById(`user-info`);
/* functions */
const getUsers = async (url) => {
    try {
        const result = await fetch(url).then(res => res.json()).then(res => res.map(res => `<li>${res.login}</li>`));
        return result.join("");
    } catch (error) {
        console.error(error);
    }
};
const getRepos = () => {
    if (inputEl.value) {
        fetch(`https://api.github.com/users/${inputEl.value}`).then(res => res.json()).then(async (info) => {
            UserInfoEl.innerHTML = ``;
            const { login, name, avatar_url: avatar, type, html_url: account, following: following_count, following_url, followers: followers_count, followers_url, public_gists, public_repos, bio } = info;
            let followers = await getUsers(followers_url);
            let following = await getUsers(following_url.slice(0, -13));

            const user = document.createElement(`div`);
            user.classList.add(`user`);
            user.innerHTML = `
            <img src="${avatar}" alt="${login} avatar">
            <div>Name: <span>${name}</span></div>
            <div>Type: <span>${type}</span></div>
            <div>Account: <a href="${account}" target="_blank">github</a></div>`;
            UserInfoEl.appendChild(user);

            const biography = document.createElement(`div`);
            biography.innerHTML = `
            <h2>Biography</h2>
            <div id="bio">${bio}</div>`;
            UserInfoEl.appendChild(biography);

            const div = document.createElement(`div`);
            div.innerHTML = `
            <details> 
                <summary>Followers: <span>${followers_count}</span></summary>
                <ul>${followers}</ul>
            </details>
            <details> 
                <summary>Following: <span>${following_count}</span></summary>
                <ul>${following}</ul>
            </details>
            <div>Public repos: <span>${public_repos}</span></div>
            <div>Public gists: <span>${public_gists}</span></div>`;
            UserInfoEl.appendChild(div);
        }).catch(err => console.error(err));
        reposEl.innerHTML = ``;
        fetch(`https://api.github.com/users/${inputEl.value}/repos`)
            .then(res => res.json())
            .then(repos => {
                repos.map(repo => {
                    const { name, created_at, open_issues_count, watchers_count, description, language, forks_count, stargazers_count, topics } = repo;
                    const repoUrl = `https://github.com/${inputEl.value}/${name}`;
                    const card = document.createElement(`div`);
                    card.classList.add(`card`);
                    card.classList.add(`card-theme-${Math.ceil(Math.random() * 3)}`);
                    card.setAttribute(`data-tilt`, ``);
                    card.setAttribute(`data-tilt-scale`, `1.05`);
                    card.setAttribute(`data-tilt-glare`, ``);
                    card.setAttribute(`data-tilt-max-glare`, `0.5`);
                    card.setAttribute(`data-tilt-reset`, `false`);
                    card.innerHTML = ` <div class="repo-info">
                    <div class="title">
                        <div class="date-link-container">
                            <h6 class="date">${created_at}</h6>
                            <a id="link" href="${repoUrl}" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em"
                                    height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                    <path fill="none" stroke="currentColor" stroke-linecap="round"
                                        stroke-linejoin="round" stroke-width="2"
                                        d="M13.5 10.5L21 3m-5 0h5v5m0 6v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
                                </svg>
                            </a>
                        </div>
                        <h1 class="name">${name}</h1>
                    </div>
                    <div class="description">
                        <p class="section-title">description</p>
                        <p>${description}</p>
                    </div>
                    <div class="topics">
                        <p class="section-title">topics</p>
                        <ul>
                            ${topics.map(topic => `<li>${topic}</li>`).join("|")}
                        </ul>
                    </div>
                        <div class="language">
                            <p class="section-title">language</p>
                            <ul>
                                <li>${language}</li>
                            </ul>
                        </div>
                    </div>
                <div class="stats">
                    <div>
                        <p>${forks_count}</p>
                        <span>forks</span>
                    </div>
                    <div>
                        <p>${stargazers_count}</p>
                        <span>stars</span>
                    </div>
                    <div>
                        <p>${watchers_count}</p>
                        <span>watchers</span>
                    </div>
                    <div>
                        <p>${open_issues_count}</p>
                        <span>issues</span>
                    </div>
                </div>`;
                    reposEl.appendChild(card);
                });
            }).then(() => VanillaTilt.init(document.querySelectorAll(".card"))).catch(err => console.error(err));
    } else {
        reposEl.innerHTML = `Please Type A Username!`;
        UserInfoEl.innerHTML = `No Data To Show`;
    }
};
/* event listeners */
buttonEl.addEventListener('click', getRepos);
