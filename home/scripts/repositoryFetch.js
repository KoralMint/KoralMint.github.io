
const apiURL = `https://api.github.com/repos/`;
const shownRepos = [
    "KoralMint/deliketchup",
    "KoralMint/KoralMint.github.io",
    "KoralMint/InteractableGridLayoutEditor",
    "ERUTONE/Smartphone-EasyPCCP-Plan"
]

function fetchRepositories(){
    const repositoriesList = document.getElementById('repository-list');
    repositoriesList.innerHTML = "";

    for (let i = 0; i < shownRepos.length; i++) {

        const repoAPIURL = apiURL + shownRepos[i];
        fetch(repoAPIURL)
            .then(response => {
            switch (response.status) {
                case 200:
                return response.json();
                case 403:
                return Promise.reject(new Error('API rate limit exceeded.'));
                case 404:
                return Promise.reject(new Error('Repository not found'));
                default:
                return Promise.reject(new Error('Something went wrong'));
            }
            })
            .then(data => {
            const repo = generateRepositoryBox(data);
            repositoriesList.appendChild(repo);
            })
            .catch(error => {
            const errorMessage = document.createElement('li');
            errorMessage.classList.add('repository', 'error');
            errorMessage.innerHTML = `<p>${error.message}</p>`;
            repositoriesList.appendChild(errorMessage);
            });
    }
}

function generateRepositoryBox(data){
    const repo = document.createElement('li');
    repo.classList.add('repository');
    try {
        repo.innerHTML = `
            <a href="${data.owner.html_url}" target="_blank">
                <img src="${data.owner.avatar_url}" alt="Author Avatar" class="repository-avatar">
            </a>
            <a href="${data.html_url}" target="_blank">
                <h3>${data.full_name}</h3>
            </a>
            <p>${data.description || "This repository has no description"}</p>
        `;
    } catch (error) {
        console.error("failed to generate repository box");
    }
    navigates = document.createElement('div');
    navigates.classList.add('flex-row');

    function generateNavigateButton(url, text){
        const button = document.createElement('a');
        button.href = url;
        button.classList.add('button', 'navigate');
        button.target = "_blank";
        button.innerText = text;
        return button;
    }

    try {
        if (data.html_url) {
            const goRepository = generateNavigateButton(data.html_url, "Open Repository");
            navigates.appendChild(goRepository);
        }
        if (data.homepage) {
            const goHomepage = generateNavigateButton(data.homepage, "Open Homepage");
            navigates.appendChild(goHomepage);
        }
        // if (checkHasDeployments(data.deployments_url)) {
        //     const goDeployments = generateNavigateButton(data.html_url+"/deployments", "Open Deployments");
        //     navigates.appendChild(goDeployments);
        // }
        
    } catch (error) {
        console.error("failed to generate navigates");
    }

    repo.appendChild(navigates);
    return repo;
}

async function checkHasDeployments(depAPIURL) {
    try {
        const response = await fetch(depAPIURL);
        switch (response.status) {
            case 200:
                const data = await response.json();
                return data.length > 0;
            case 403:
                throw new Error('API rate limit exceeded');
            case 404:
                throw new Error('Repository not found');
            default:
                throw new Error('Something went wrong');
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

function generateDummy(){
    const repositoriesList = document.getElementById('repository-list');
    for (let i = 0; i < 4; i++) {
        const repo = document.createElement('li');
        repo.classList.add('repository');
        
        repo.innerHTML = `
            <img src="https://avatars.githubusercontent.com/u/72883217?v=4" alt="Author Avatar" class="repository-avatar">
            <a href=" " target="_blank">
                <h3>Author/Repository</h3>
            </a>
            <p>This repository has no description</p>
        `;
        repositoriesList.appendChild(repo);
    }
}