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

Simply run:

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
- [x] Auto db init (if not exists) 
- [ ] Create Ubuntu container with Newman for running API Endpoint tests
- [ ] Better logging
- [ ] Expose Endpoints for RAG - Insert, Update, Delete (by intent_ID)
- [ ] Test Vector-Store Retrieval
- [ ] Add Navigation Agent
- [ ] Expose agent through API
- [ ] **IMPORTANT**: Ensure saved Chroma DB is writable (should work inside container)