# PRD — TODO App Vanilla

## 1. Visión

Una TODO app simple, rápida y sin dependencias, desplegada en GitHub Pages. Ejercicio práctico del flujo OpenClaw + Gentle AI (SDD, Agent Teams, Engram, Skills).

## 2. Análisis Competitivo

### Apps analizadas (2026)

| App | Score | Fortaleza clave |
|-----|-------|-----------------|
| Todoist | 9.4/10 | Natural language input, karma gamification, filters/labels |
| Things 3 | 9.2/10 | Diseño excepcional, Today view con calendario, Areas/Projects/Headings |
| TickTick | 9.0/10 | Free tier generoso, Pomodoro integrado, habit tracking |
| Microsoft To Do | 8.7/10 | Integración Microsoft 365, My Day planning |
| Any.do | 8.5/10 | Simplicidad, daily planning, calendar + tasks unificado |
| Google Tasks | 8.2/10 | Minimalismo, integración Gmail/Calendar |

### Features extraídas de las top 3

**De Todoist:**
- Quick add con natural language ("comprar leche mañana 9am")
- Prioridades (P1-P4)
- Filtros y labels
- Karma/gamification (streaks, puntos por completar)

**De Things 3:**
- Vista Today / Upcoming / Anytime / Someday
- Áreas de responsabilidad (Trabajo, Personal, etc.)
- Headings dentro de projects para agrupar subtareas
- Logbook (tareas completadas archivadas)

**De TickTick:**
- Filtros inteligentes (alta prioridad, vencidas hoy)
- Toggle completed/active
- Contador de tareas pendientes

## 3. Alcance — MVP

### Must Have (P0)
- [ ] Crear tarea (texto + enter)
- [ ] Marcar como completada (checkbox)
- [ ] Eliminar tarea
- [ ] Editar tarea inline
- [ ] Persistencia con localStorage
- [ ] Filtro: All / Active / Completed
- [ ] Contador de tareas activas
- [ ] Clear completed (bulk delete)

### Should Have (P1)
- [ ] Prioridades (Alta/Media/Baja) con color coding
- [ ] Drag & drop reorder
- [ ] Dark mode toggle (persiste preferencia)
- [ ] Empty state con mensaje amigable

### Nice to Have (P2)
- [ ] Filtros por prioridad
- [ ] Fecha de creación mostrada
- [ ] Animaciones de entrada/salida
- [ ] Exportar/Importar JSON

### Out of Scope (por ahora)
- Subtareas
- Fechas de vencimiento
- Categorías/proyectos múltiples
- Sync entre dispositivos
- Notificaciones
- Colaboración

## 4. Stack Técnico

- **HTML** — estructura semántica
- **CSS** — estilos, dark mode con CSS variables
- **JavaScript (ES6+)** — lógica, sin frameworks
- **localStorage** — persistencia
- **GitHub Pages** — deploy estático
- **GitHub Actions** — CI/CD (opcional para auto-deploy)

Cero build step. Cero npm. Cero dependencias.

## 5. Arquitectura

```
todo-app/
├── index.html      # Estructura + link a CSS/JS
├── styles.css      # Estilos + dark mode
├── app.js          # Lógica de la app
└── PRD.md          # Este documento
```

### Estructura de datos (localStorage)

```json
{
  "todos": [
    {
      "id": "uuid",
      "text": "Comprar leche",
      "completed": false,
      "priority": "medium",
      "createdAt": "2026-07-23T05:00:00Z"
    }
  ],
  "filter": "all",
  "theme": "light"
}
```

## 6. UX

- Input fijo arriba, lista abajo
- Enter para agregar
- Click en checkbox para completar
- Doble click en texto para editar
- Botón X al hover para eliminar
- Filtros como tabs (All / Active / Completed)
- Contador abajo a la izquierda
- Clear completed abajo a la derecha

## 7. Criterios de Aceptación

1. Puedo agregar una tarea presionando Enter
2. La tarea aparece en la lista inmediatamente
3. Al recargar la página, las tareas persisten
4. Puedo marcar/desmarcar como completada
5. Puedo editar el texto inline
6. Puedo eliminar una tarea
7. Los filtros funcionan correctamente
8. El contador muestra el número correcto
9. Dark mode funciona y persiste
10. Funciona en mobile (responsive)

## 8. Deploy

1. Crear repo en GitHub
2. Push del código a la rama `main`
3. Settings → Pages → Source: `main` branch
4. URL: `https://[usuario].github.io/[repo]/`