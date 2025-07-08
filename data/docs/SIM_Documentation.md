# Summary of GenAI for SIM Documentation

## Overview
The **GenAI for SIM** documentation outlines the development of an agnostic platform API that supports **summarization** and **navigation** functionalities for web, Android, and iOS applications. It leverages **Generative AI** to process **text** and **voice inputs**, providing seamless interaction across platforms. The system integrates advanced machine learning models, cloud infrastructure, and secure data handling to deliver efficient and scalable solutions.

## Key Components

### 1. **GenAI Architecture**
- **Text Embedding Model**: Utilizes Hugging Face MiniLM (L6) to convert text into 384-dimensional embeddings, deployed on AWS SageMaker (ml.g4dn.xlarge).
- **Chat Model**: Employs Meta’s Llama-2-7B for understanding user queries and generating responses, hosted on SageMaker (ml.g5.xlarge).
- **Code Generation Model**: Uses Meta’s CodeLlama-7B-Instruct for generating code, also hosted on SageMaker (ml.g5.xlarge).
- **Knowledge Bases**:
  - **Schema Definition**: Stores table descriptions in CSV files on AWS S3, processed into vector stores using FAISS for efficient schema comprehension.
  - **Navigation/Sitemap**: Maintains a catalog of modules, pages, and user activities, converted into embeddings and stored in FAISS indices on S3.

### 2. **Process Workflow**
- **Data Processing**: CSV files are loaded, chunked, and converted into embeddings for storage in FAISS vector stores.
- **Query Handling**:
  - User intent (navigation or summarization) is identified.
  - Relevant vector stores are queried using similarity search (FAISS).
  - Results are processed by appropriate models to generate responses or SQL queries.
- **Azure SQL Integration**: SQL queries are dynamically generated, executed on Azure SQL, and results are summarized using Llama models.
- **Audio Processing**: AWS Transcribe converts audio inputs into text, stored as JSON in S3, and processed for further queries.

### 3. **API Overview**
- **Converse API**: Handles user queries for navigation or summarization, accepting inputs like user query, platform (iOS/Android/web), and preferred format (HTML/JSON). Returns responses with generated SQL, text, or data.
- **Vector-Refresh API**: Programmatically updates vector stores for schema and navigation data, ensuring seamless updates without manual intervention.
- **Authentication**: Uses OAuth tokens via Keycloak for secure access, integrating with a service user profile for API authentication.

### 4. **Infrastructure**
- **AWS Lambda**: Deploys serverless functions (`lambda_function_converse` and `lambda_function_vector`) in a private VPC subnet for secure execution.
- **S3 Storage**: Stores CSV files, processed data, and FAISS indices.
- **SageMaker Endpoints**: Host AI models for embedding, chat, and code generation.
- **CI/CD Pipeline**: Uses GitHub, Jenkins, and AWS ECR to automate code deployment with Docker images.
- **Networking**: Employs NAT Gateway, S3 Gateway Endpoint, and SageMaker Runtime/API endpoints for secure communication.

### 5. **Maintenance and Enhancements**
- **Navigation Updates**: Involves updating CSV files (e.g., `navigation_links.csv`) and reprocessing vector stores when new functionalities are added.
- **Schema Updates**: Modifies schema CSV files (e.g., `SIM-Tables-descriptions_performance.csv`) and regenerates vector stores for new tables or KPIs.
- **Model Switching**: Supports modular model updates, requiring configuration changes for new models while maintaining pipeline compatibility.

### 6. **Security Guardrails**
- **Data Encryption**: Uses TLS for Azure SQL connections with `Encrypt=yes` and `TrustServerCertificate=yes`.
- **Secrets Management**: Stores Azure SQL credentials in AWS Secrets Manager.
- **Network Security**: Deploys Lambda functions in a private subnet, uses a NAT Gateway with a whitelisted Elastic IP, and restricts Security Group access to specific VPC CIDRs.
- **Authentication**: Employs Keycloak for OAuth-based API access with secure service credentials.
- **Logging**: Enables CloudWatch logs for monitoring Lambda function activities.

## Features
- **Multi-Platform Support**: Compatible with web, Android, and iOS applications.
- **Voice and Text Inputs**: Processes both text and audio inputs using AWS Transcribe.
- **Dynamic SQL Generation**: Generates and executes SQL queries on Azure SQL for schema-related queries.
- **Scalable Infrastructure**: Leverages serverless AWS Lambda and SageMaker for efficient scaling.
- **Automated Updates**: Vector-Refresh API and CI/CD pipeline ensure seamless updates to knowledge bases and code.

## Guardrails
- **Secure Data Handling**: Encrypts data in transit and uses secure storage for credentials.
- **Restricted Access**: Limits API and database access to authorized users via OAuth and whitelisted IPs.
- **Error Handling**: Defines a comprehensive error catalog with status codes and messages for robust system reliability.
- **Modular Design**: Ensures flexibility for model updates and pipeline compatibility, minimizing disruptions.

This summary provides a high-level understanding of the GenAI for SIM platform, focusing on its architecture, workflow, APIs, infrastructure, and security measures, making it a robust solution for summarization and navigation tasks.