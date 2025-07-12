# Aatmun - Research & Development

### Architecture Diagram

![NavigationDiagram](./data/images/navigation_diagram.png)

## Installation

It is recommended to use `pipenv` to manage dependencies.

```bash
# install pipenv
pip install pipenv
```

```bash
# create a pipenv shell/virtualenv
pipenv shell
```

```bash
# install packages
pipenv install
```

## Running

The project is designed to run as docker containers with live reload.

You need Chat `llama3.2:3b` and Embedding `nomic-embed-text` models to use the Navigation API. First time, run this command

```bash
make init
```

Now you can do

```bash
make dev
```

This will use the [docker-compose.yml](./docker-compose.yml) and build a FastAPI container image based on [Dockerfile](./Dockerfile).

```bash
docker ps --format '{{.Names}}'
```

```
aatmun-api
ollama
```

### Test

You can run tests using `newman`

```bash
make tests
```

## Development

All R&D has been documented as jupter [notebooks](./notebooks/). They can be explored by installing `jupter`

```bash
pip install jupyter
```

and running:

```bash
jupyter notebook
```

## To-Do:

# Project Checklist

- [x] Expose endpoints for SQLite
- [ ] Add Username/Password OAuth
- [ ] Ensure sqlite updations are reflected in chroma
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
        - [x] View
        - [x] Delete
        - [ ] Update
    - [x] Navigation
        - [ ] Get Navigation
        - [ ] Run tests (excel file input)
    
- [x] Expose Navigation Endpoint
    - [x] Query navigation
    - [ ] Add, Update, Delete Navigation Intents
- [ ] Asciinema (svg docs) 