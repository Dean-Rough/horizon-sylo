# Sylo-core: AI Core Orchestration Engine

## Overview

Sylo-core is the central AI orchestration engine designed to provide agentic control over all core functions of the Sylo platform. Instead of connecting disparate API endpoints, Sylo-core acts as a unified interface that manages and routes commands to various system functions, enabling seamless integration and extensibility.

This architecture simplifies adding new features and enhances maintainability by centralizing control logic and AI interactions.

## Architecture and Design Principles

- **Centralized Command Dispatcher:** Sylo-core exposes a single API endpoint that accepts commands with action names and parameters, dispatching them internally to appropriate service functions or APIs.
- **Modular and Extensible:** Designed to easily incorporate new commands and functionalities without disrupting existing workflows.
- **Unified Authentication and Validation:** Handles user authentication, input validation, and error management centrally.
- **AI-First Integration:** Provides a clean interface for AI agents to invoke any system function, enabling agentic control and automation.
- **Decoupled from UI:** Operates independently of frontend components, focusing solely on backend orchestration.

## Requirements and Goals

- Provide a single, extensible API for all core platform functions.
- Enable AI agents to control project management, task handling, material library, MCP integrations, and more.
- Ensure robust security with role-based access control and session management.
- Maintain high performance with efficient routing and caching strategies.
- Facilitate easy testing and monitoring of orchestration flows.

## Integration with Existing Systems

Sylo-core interfaces with existing backend services and database layers, including:

- Project, Task, and Material APIs
- MCP AI integration endpoints (Pinterest, SketchUp)
- Authentication and authorization services
- Database via Supabase client

It abstracts these services behind a unified command interface, simplifying client and AI interactions.

## Extensibility and Future Plans

- Support for additional AI agents and external integrations.
- Dynamic command registration and plugin architecture.
- Enhanced monitoring and analytics for orchestration flows.
- Support for workflow automation and complex multi-step processes.

---

For more details, see the [Sylo-core API Design Document](#) (to be created).

---

*This document is part of the Sylo technical documentation suite.*
