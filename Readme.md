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

## To-Do:

# Project Checklist

- [x] Expose endpoints for SQLite
- [ ] Add Username/Password OAuth
- [ ] Ensure sqlite updations are reflected in chroma
    - [x] Add
    - [x] Delete
    - [x] Update
- [x] Auto db init (if not exists) 
- [x] Command to pull Ollama models
- [ ] Improve LLM Accuracy
    - [ ] Get more context (vectordb)
    - [ ] Multiple LLM Call (best on N)
    - [ ] Check if vector score is a good metric
    - [ ] If LLM decision != vector top 1, re-consider evaluate_llm_decision (Node/Function)
- [X] Use Newman for running tests
    - [ ] Update variable values
    - [ ] Add tests for new endpoints
- [ ] Better logging
    - [ ] Raise HTTP Exceptions
- [x] Test Vector-Store Retrieval
- [x] Add Navigation Agent
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
    - [ ] Remvove Chroam ID Edit option
- [x] Expose Navigation Endpoint
    - [x] Query navigation
    - [ ] Add, Update, Delete Navigation Intents
- [ ] Server side API calls so routes aren't exposed and I can use internal hostnames not browser supported ones
- [ ] Asciinema (svg docs) 
- [ ] IMPORTANT! - Update doc-strings
- [ ] On fresh install, missing node_modules / .next folder
- [ ] Streaming
