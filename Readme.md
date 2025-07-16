# Aatmun - PoC

![Stack](https://skillicons.dev/icons?i=ubuntu,bash,py)


[Documentation](./data/docs/Documentation.md)

## Models

| Chat Model  | Embedding Model       |
|-------------|-----------------------|
| llama3.2:3b | nomic-embed-text:v1.5 |

Models are served through Ollama 

## Usage

The project is designed to run as docker containers with live reload.

> [!NOTE]
> Run this command on the first run to initialize


```bash
make init
```

![Init command](./data/images/init.svg)


Now simply run

```bash
make dev
```

![Dev command](./data/images/dev.svg)


This will use the [docker-compose.yml](./docker-compose.yml) and build a FastAPI container image based on [Dockerfile](./Dockerfile).

```bash
docker ps --format '{{.Names}}'
```

```
aatmun-api
aatmun-frontend
ollama
```

### Testing

You can run tests for the API using `newman`

```bash
make tests
```

![Test command](./data/images/test.svg)


## Development

### API

Get pipenv

```bash
# install pipenv
pip install pipenv
```

Create a virtual environment

```bash
# create a pipenv shell/virtualenv
pipenv shell
```

Install packages with pipenv
```bash
# install packages
pipenv install
```

### R&D
All R&D has been documented as jupter [notebooks](./notebooks/). They can be explored by installing `jupter`

```bash
pip install jupyter
```

and run:

```bash
jupyter notebook
```

### Frontend
Mount the local directory by uncommenting the following in [comopose](./docker-compose.yml)

```yml
volumes:
    - ./frontend:/app
```

Install npm packages

```bash
cd frontend 
npm i --force
```

Run the React application

```bash
npm run dev
```

## Checklist

- [x] Expose endpoints for SQLite
- [ ] Add OAuth (JWT Token from user/pwd)
- [x] Test Vector-Store Retrieval
- [x] Add Navigation Agent
- [X] Ensure Chroma & Sqlite updates are synced
- [x] Populate fresh db with dummy data
- [x] Pull Ollama models on first run
- [x] Improve LLM Accuracy
    - [x] Get more context (vectordb)
    - [x] Multiple LLM Call (best on N)
    - [x] Check if vector score is a good metric
    - [x] If LLM, Retriever discerepancy, re-evaluate
    - [ ] Get accuracy feedback from user (logging)
    - [ ] LLM Cache for User Validated Output
- [X] Use Newman for API Test
    - [ ] Dynamically update variable values
    - [ ] Add tests for new endpoints
- [ ] Better logging
    - [ ] Raise HTTP Exceptions
- [x] Create Frontend
    - [x] Database
        - [x] Add pagination
        - [x] Create,Edit Modals
        - [x] View
        - [x] Delete
        - [x] Update
    - [x] Navigation
        - [X] Get Navigation
        - [X] Run tests (excel file input)
    - [X] Remvove Chroma ID from Update intent
    - [X] Split page.tsx into components
    - [ ] Ensure frontend works off the bat on fresh clone
- [x] Expose Navigation Endpoint
    - [x] Query navigation
    - [X] Add, Update, Delete Navigation Intents
- [ ] Server side API calls so routes aren't exposed and I can use internal hostnames (Optional)
- [x] Asciinema (svg docs) 
- [x] Update doc-strings
- [x] Streaming for Test Cases
- [ ] Ensure Ollama doesn't sleep too soon