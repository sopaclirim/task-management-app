# Task Management Application

Aplikacion modern i menaxhimit të detyrave për ekipin e kompanisë, i krijuar me React.js.

## Karakteristika

- **Sistem i Roleve**: Team Leader dhe Team Member
- **Krijim dhe Delegim Detyrash**: Team Leader-i mund të krijojë dhe të delegojë detyra për anëtarët e ekipit
- **Gjurmim Statusi**: Detyrat mund të kenë status: Nuk është Filluar, Në Progres, ose E Përfunduar
- **Dashboard Interaktiv**: Shikimi i detyrave sipas statusit në kolona
- **Statistika**: Përmbledhje e detyrave dhe përqindja e përfundimit
- **UI Modern**: Dizajn i bukur dhe responsive

## Instalimi

1. Instalo dependencies:
```bash
npm install
```

2. Nis aplikacionin:
```bash
npm run dev
```

3. Hap browser-in në `http://localhost:5173`

## Llogaritë e Testit

### Team Leader
- **Email**: `leader@company.com`
- **Password**: `leader123`

### Team Members
- **Email**: `ana@company.com` / **Password**: `member123`
- **Email**: `bekim@company.com` / **Password**: `member123`
- **Email**: `drita@company.com` / **Password**: `member123`
- **Email**: `fisnik@company.com` / **Password**: `member123`

## Si të Përdoret

### Për Team Leader:

1. **Hyr në sistem** me llogarinë e Team Leader
2. **Krijo detyra të reja** duke klikuar "Krijo Detyrë të Re"
3. **Cakto detyrat** për anëtarët e ekipit
4. **Shiko të gjitha detyrat** në dashboard
5. **Fshi detyrat** nëse është e nevojshme

### Për Team Members:

1. **Hyr në sistem** me llogarinë tënde
2. **Shiko detyrat e tua** të deleguara nga Team Leader
3. **Ndrysho statusin** e detyrës:
   - Nuk është Filluar → Në Progres → E Përfunduar
4. **Shiko statistikat** e detyrave të tua

## Struktura e Projektit

```
src/
├── components/          # Komponentët React
│   ├── Login.jsx       # Faqja e hyrjes
│   ├── Dashboard.jsx   # Dashboard kryesor
│   ├── CreateTask.jsx  # Forma për krijimin e detyrave
│   ├── TaskList.jsx    # Lista e detyrave
│   ├── TaskItem.jsx    # Komponenti për çdo detyrë
│   └── TaskStats.jsx   # Statistikat
├── context/
│   └── TaskContext.jsx # State management me Context API
└── App.jsx             # Komponenti kryesor
```

## Teknologjitë e Përdorura

- **React 18** - Library për UI
- **React Router** - Routing
- **Vite** - Build tool dhe dev server
- **Context API** - State management
- **CSS3** - Styling modern

## Shënime

- Të dhënat ruhen në localStorage (për demo)
- Në prodhim, duhet të integrohet me backend API
- Autentifikimi aktual është i thjeshtë për demo

## Build për Produksion

```bash
npm run build
```

Fajllat e build-uara do të jenë në dosjen `dist/`.

# A web application for task management in companies.
