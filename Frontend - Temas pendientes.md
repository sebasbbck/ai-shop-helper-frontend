# Frontend - Temas pendientes

- **Autor:** Diego José Pérez Vargas
- **Proyecto:** AI Shop Helper
- **Fecha:** 7 de abril de 2026

## Tabla de contenidos

1. [Contexto](#contexto)
2. [Estado actual del proyecto](#estado-actual-del-proyecto)
    - 2.1. [Proceso general de migración](#proceso-general-de-migración)
3. [Temas pendientes](#temas-pendientes)
4. [Consideraciones para continuar con el desarrollo](#consideraciones-para-continuar-con-el-desarrollo)
    - 4.1. [Entorno](#entorno)

## Contexto

Este documento ha sido elaborado para recopilar los asuntos pendientes relacionados con el desarrollo del frontend de AI Shop Helper y permitir reanudar el desarrollo tras el 8 de abril, día en que el periodo de prácticas del autor de este documento concluirá y, por tanto, el principal desarrollador de frontend de este proyecto abandonará su puesto. El documento complementa a la documentación del proyecto full stack, disponible en su repositorio como archivos README.

## Estado actual del proyecto

Actualmente, el frontend se encuentra en una fase de reescritura. La antigua implementación realizada en [el proyecto full stack de FastAPI](https://github.com/AI-Shop-Helper/aishophelper-fullstack) está siendo trasladada y adaptada al [nuevo repositorio](https://github.com/AI-Shop-Helper/ai-shop-helper-frontend). Los objetivos principales de esto son conseguir que el proyecto se pueda desplegar en AWS, corregir los malos hábitos adquiridos en los meses previos al comienzo de la migración del frontend y eliminar todo lo que no sea necesario para optimizar y aumentar la escalabilidad de la aplicación.

La migración está completada parcialmente, tanto en el frontend como en el backend. Para ver más detalles sobre el estado y los objetivos de la migración, consulta la tarjeta [_Migración del frontend al nuevo repositorio_](https://trello.com/c/Zoksg14j/232-migraci%C3%B3n-de-front-al-nuevo-repositorio) en Trello. Ahí se encuentran dos PDFs de documentación, generados por Claude. El inglés es más detallado y técnico, mientras que el español es más resumido y casual. Deberían interpretarse como documentos orientativos, a pesar de definir un plan de migración.

### Proceso general de migración

Para explicar las consideraciones generales que hay que tener para los distintos archivos del proyecto, vamos a ver un ejemplo con la pantalla de ajustes de usuario. En el antiguo frontend, esta se encuentra en `src/sections/account/account-general.tsx`, mientras que en el nuevo, está en `src/features/settings/components/SettingsGeneral.tsx`.

- **Alias de directorio**: En el proyecto anterior, se utilizaba `@/` para módulos internos. Ahora, utilizamos direcciones relativas. Por ejemplo, así importamos los hooks en el nuevo repositorio:

    ```tsx
    import useCustomToast from '../../../hooks/useCustomToast'
    import useAuth from '../../../hooks/useAuth'
    import useHandleError from '../../../hooks/useHandleError'
    ```

    Y así se hace en el viejo:

    ```tsx
    import useCustomToast from '@/hooks/useCustomToast'
    import useAuth from '@/hooks/useAuth'
    import useHandleError from "@/hooks/useHandleError"
    ```

- **Fuente de traducciones**: En vez de utilizar la biblioteca `react-i18next` para las traducciones, importamos el hook `useTranslation` de `next-i18next`.

- **Llamadas a la API**: El proyecto anterior usaba `@hey-api/openapi-ts` como generador, mientras que ahora usamos Orval. Los archivos generados van al directorio `/api`, donde se encuentran los modelos y los métodos necesarios para hacer uso de la API.

    La gran mayoría del directorio `/api` está compuesto de archivos generados automáticamente por Orval, excepto `api/mutator/custom-instance.ts`, que no debe ser eliminado ya que es una instancia personalizada de Axios que se utiliza para enviar peticiones al backend con el contexto de la sesión de usuario y permite refrescar la sesión automáticamente cuando expira.

    En el caso del proyecto anterior, importábamos

    ```tsx
    import { UsersService, UserUpdateMe } from '@/client'
    ```

    `UsersService` contiene las distintas llamadas al servicio de usuarios y `UserUpdateMe` es el tipo que define los datos que se deben enviar al actualizar el usuario. Esto nos proporciona lo necesario para hacer una llamada a PATCH /users/me con los datos de usuario proporcionados por el formulario en la página.

    ```tsx
      const mutation = useMutation({
        mutationFn: (data: UserUpdateMe) =>
          UsersService.updateUserMe({ requestBody: data }),
        onSuccess: () => {
          showSuccessToast(t("settings.general.successful_save"))
          queryClient.invalidateQueries({ queryKey: ["users"] })
        },
        onError: (err) => {
          handleError(err)
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["users"] })
        },
      })
    ```

    En el nuevo proyecto, utilizamos un hook personalizado para la mutación.

    ```tsx
      import { getGetUserQueryKey, useUpdateMe } from '../../../../api/users/users'
      import { UserUpdate } from '../../../../api/model'

      (...)

      const updateMutation = useUpdateMe({
        mutation: {
          onSuccess: () => {
            showSuccessToast(t("translation:settings.general.successful_save"))
            reset(undefined, { keepValues: true })
          },
          onError: (err) => {
            handleError(err)
          },
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey: getGetUserQueryKey(user?.id) })
          },
        },
      })
    ```

- **Modelo de datos**: Al haber cambiado la estructura de los datos en el backend, también hay que tener en cuenta que pueden cambiar algunos nombres. En esta pantalla, `user.full_name` pasa a `user.name`. Estos cambios son fáciles de detectar si utilizamos los modelos generados automáticamente por Orval cuando utilizamos información que proviene de la API.

Esta pantalla también ha recibido algunos cambios aparte de los listados aquí, pero no tienen que ver con la migración. Por ejemplo, `onSuccess` ahora llama a `reset(undefined, { keepValues: true })`, que elimina el estado de "sucio" del formulario actual sin borrarlo, para así mostrar los cambios aplicados al perfil de usuario en la pantalla de ajustes. Al hacer la migración de un archivo, es posible que encuentres problemas u oportunidades de mejora.

## Temas pendientes

Esta sección define algunos aspectos de la migración del frontend o de tareas de desarrollo en los que no se ha llegado a un acuerdo o que no han sido completadas todavía.

### Redactor de blog

El código actual del generador de blog es extremadamente complejo. El archivo tiene demasiadas líneas como para ser fácilmente reescribible, pero vendría bien analizarlo a fondo porque hay algunas partes que son altamente reutilizables, como la subida de archivos o las tablas de publicaciones en borrador/pendientes/publicadas. Para ver una versión más fácilmente reutilizable de la tarjeta de pasos del agente, consultad la rama `feat/product-optimiser` del repositorio full stack; en concreto, `src/pages/dashboard/catalogue-organiser.tsx` tiene una tarjeta casi igual que la del redactor de blog con los pasos definidos a mano.

**Nota de internacionalización**: en el proyecto full stack, las preguntas y sus descripciones no estaban traducidas porque venían directamente del backend. Si son preguntas que van a variar a menudo, se debería definir las traducciones en la base de datos. Si son fijas, se puede añadir las claves a los archivos de traducción.

### Nuevos datos de usuario en el registro

Hay que añadir la razón social y el NIF en el formulario de registro para utilizarlos como datos a la hora de crear organizaciones. Sin embargo, AI Shop Helper está traducido a varios idiomas y los países en los que más se usan los otros idiomas tienen distintas formas de identificar personas físicas y jurídicas que el NIF, y no se puede esperar que un usuario de AI Shop Helper que utilice la página en francés tenga un NIF español. Razón social se puede traducir como _nombre de empresa_.

### Pago

Actualmente, está decidido que el pago se va a hacer como un paso intermedio tras el registro y antes del onboarding. La pantalla de pago básica se encuentra en `experiments/stripe` y actualmente el pago se hace enviando una petición a la API de Stripe con el cliente de Next.js. Esto era solo una prueba y debería ser el backend el que llame a Stripe para confirmar el pago y, de paso, asigne la suscripción al usuario.

Para continuar con esta parte, son relevantes estas páginas de la documentación de Stripe:

- [Stripe Payment Element](https://docs.stripe.com/payments/payment-element)
- [Build a subscriptions integration](https://docs.stripe.com/billing/subscriptions/build-subscriptions?payment-ui=elements&api-integration=paymentintents)
- [Accept a payment](https://docs.stripe.com/payments/accept-a-payment?payment-ui=elements&api-integration=paymentintents)
- [API keys](https://docs.stripe.com/keys)

La mayoría de la documentación de Stripe está traducida al español y se puede seleccionar el idioma en la parte inferior izquierda de la página.

### Onboarding

El onboarding de la aplicación en el repositorio full stack funciona con un overlay de [NextStepJS](https://nextstepjs.com/) altamente personalizado, en el que los pasos se cargan desde el backend.

- **`src/routes/$lang/index.tsx`**: lee las respuestas a las preguntas del onboarding del usuario actual y selecciona las preguntas sin responder o las preguntas con una respuesta autocompletada. Si hay preguntas que cumplen esos criterios, muestra el onboarding con esas preguntas. Hay lógica especial para manejar el caso en el que el usuario ha especificado la URL de su WordPress, pero no ha terminado de establecer la conexión, para mostrarle la pregunta de la URL de nuevo.
- **`src/components/onboarding/steps.tsx`**: maneja el orden de las preguntas y la lógica para enviar la respuesta y pasar a la siguiente. Muestra la entrada de texto y/o los botones necesarios según la pregunta.
- **`src/components/onboarding/custom-card.tsx`**: la tarjeta en la que se muestra el título de la pregunta y el contenido necesario para responderla, proveniente de `steps.tsx`.

La gran desventaja que tiene esta solución es que el onboarding solo se muestra en la pantalla de los cuatro agentes y que es posible esquivar el onboarding pulsando el botón de atrás en el ratón o en el navegador, o introduciendo una URL que no sea de la página de los cuatro agentes. Entonces, un usuario podría utilizar la aplicación sin haber introducido la información de su negocio. Si esto ocurre, los flujos fallarán al ejecutarse por la falta de contexto de la empresa del usuario.

La solución propuesta actualmente es una pantalla de onboarding separada, con su propia ruta (/onboarding), a la que se redirige al usuario si intenta acceder a cualquier otra pantalla sin haber respondido a todas las preguntas. En `feat/onboarding` se encuentra la ruta y el diseño de la pantalla, con preguntas de ejemplo que no se envían al backend.

**Nota de internacionalización**: en el proyecto full stack, las preguntas y sus descripciones no estaban traducidas porque venían directamente del backend. Si son preguntas que van a variar a menudo, se debería definir las traducciones en la base de datos. Si son fijas, se puede añadir las claves a los archivos de traducción.

### Gestión de organizaciones y proyectos

La implementación de la pantalla de organizaciones está basada en la original de proyectos. Puede que todavía haya referencias a esta, así que se debe cambiar. En ambas pantallas falta la opción de unirse a una organización o a un proyecto. Actualmente se puede gestionar los miembros de una organización, para cambiar sus roles y eliminarlos de ella, pero no los de un proyecto.

### Pantallas de admin

Aunque no son estrictamente necesarias para sacar la aplicación, simplifican el acceso a la base de datos. No deberían ser muy complejas. Las nuevas pantallas de admin que vayan a listar datos como proyectos, organizaciones o flujos se pueden crear a partir de las que ya existen, como la de usuarios. Solo hay que cambiar las llamadas a la API y los datos que se introducen y envían en los formularios de creación y edición, si se van a añadir.

## Consideraciones para continuar con el desarrollo

### Entorno

- **Orval**: Para generar el código de cliente a partir de la versión más reciente de la API, ejecuta `./pull-openapi.sh`. **Importante:** esto requiere configurar la CLI de AWS con tu usuario.

- **Precommit**: Antes de hacer commit, si no se añade `--no-verify` al comando, se ejecuta una rutina de precommit que se encuentra en `.pre-commit-config.yaml`. Primero ejecuta `./pull-openapi.sh`, luego comprueba la sintaxis de los archivos YAML y JSON y acaba ejecutando Prettier en los archivos modificados para que los archivos cumplan las reglas de estilo definidas en `.prettierrc`. Si aparece un aviso, que suele ocurrir cuando ha habido cambios en la API o cuando Prettier ha modificado archivos, habrá que stagear los archivos de nuevo para poder hacer el commit.

- **Stripe**: Para poder realizar pagos de prueba de Stripe, necesitarás claves del panel de control de Stripe. Asegúrate de que estas claves tengan `_test_` en ellas en el entorno de desarrollo y que **nunca** se despliegue la aplicación con claves de prueba o con claves privadas fuera del archivo `.env`.
