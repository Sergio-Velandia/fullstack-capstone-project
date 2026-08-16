# Historia de Usuario

**Título:** Buscar artículos por categoría

**Como** un usuario de GiftLink que busca artículos gratuitos,
**quiero** poder filtrar los artículos disponibles por categoría,
**para** encontrar rápidamente los objetos que realmente me interesan sin
tener que revisar todo el catálogo.

## Criterios de aceptación

```
Dado que estoy en la página principal de GiftLink,
Cuando selecciono una categoría en el filtro de búsqueda,
Entonces la aplicación muestra únicamente los artículos que pertenecen
a esa categoría.
```

```
Dado que no hay artículos disponibles en la categoría seleccionada,
Cuando aplico el filtro,
Entonces la aplicación muestra un mensaje indicando que no se
encontraron resultados.
```

## Definición de terminado (Definition of Done)

- El endpoint `/api/search` filtra correctamente por categoría.
- La interfaz muestra los resultados actualizados sin recargar la página.
- Se probó con al menos 3 categorías distintas.
- El código fue revisado y fusionado a la rama principal.

## Prioridad
Alta

## Puntos de historia
3
