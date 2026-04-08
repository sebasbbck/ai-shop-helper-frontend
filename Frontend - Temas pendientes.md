# Frontend - Temas pendientes

- **Autor:** Diego José Pérez Vargas
- **Proyecto:** AI Shop Helper
- **Fecha:** 8 de abril de 2026

## Tabla de contenidos

1. [Contexto](#contexto)
2. [Estado actual del proyecto](#estado-actual-del-proyecto)
    - 2.1. [Proceso general de migración](#proceso-general-de-migración)
3. [Temas pendientes](#temas-pendientes)
    - 3.1. [Redactor de blog](#redactor-de-blog)
    - 3.2. [Nuevos datos de usuario en el registro](#nuevos-datos-de-usuario-en-el-registro)
    - 3.3. [Pago](#pago)
    - 3.4. [Onboarding](#onboarding)
    - 3.5. [Referidos](#referidos)
    - 3.6. [Créditos y ajustes de facturación](#créditos-y-ajustes-de-facturación)
    - 3.7. [Notificaciones](#notificaciones)
    - 3.8. [Gestión de organizaciones y proyectos](#gestión-de-organizaciones-y-proyectos)
    - 3.9. [Pantallas de admin](#pantallas-de-admin)
    - 3.10. [Internacionalización](#internacionalización)
      - 3.10.1. [Mensajes de error](#mensajes-de-error)
4. [Consideraciones para continuar con el desarrollo](#consideraciones-para-continuar-con-el-desarrollo)
    - 4.1. [Entorno](#entorno)
    - 4.2. [Ejecución](#ejecución)
    - 4.3. [Precommit](#precommit)

## Contexto

Este documento ha sido elaborado para recopilar los asuntos pendientes relacionados con el desarrollo del frontend de AI Shop Helper y permitir reanudar el desarrollo tras el 8 de abril, día en que el periodo de prácticas del autor de este documento concluirá y, por tanto, el principal desarrollador de frontend de este proyecto abandonará su puesto. El documento complementa a la documentación del proyecto full stack, disponible en su repositorio como archivos README.

## Estado actual del proyecto

Actualmente, el frontend se encuentra en una fase de reescritura. La antigua implementación realizada en [el proyecto full stack de FastAPI](https://github.com/AI-Shop-Helper/aishophelper-fullstack) está siendo trasladada y adaptada al [nuevo repositorio](https://github.com/AI-Shop-Helper/ai-shop-helper-frontend). Los objetivos principales de esto son conseguir que el proyecto se pueda desplegar en AWS, corregir los malos hábitos adquiridos en los meses previos al comienzo de la migración del frontend y eliminar todo lo que no sea necesario para optimizar y aumentar la escalabilidad de la aplicación.

La migración está completada parcialmente, tanto en el frontend como en el backend. Para ver más detalles sobre el estado y los objetivos de la migración, consulta la tarjeta [_Migración del frontend al nuevo repositorio_](https://trello.com/c/Zoksg14j/232-migraci%C3%B3n-de-front-al-nuevo-repositorio) en Trello. Ahí se encuentran dos PDFs de documentación, generados por Claude. El inglés es más detallado y técnico, mientras que el español es más resumido y casual. Deberían interpretarse como documentos orientativos, a pesar de definir un plan de migración.

### Proceso general de migración

Para explicar las consideraciones generales que hay que tener para los distintos archivos del proyecto, vamos a ver un ejemplo con la pantalla de ajustes de usuario. En el antiguo frontend, esta se encuentra en `src/sections/account/account-general.tsx`, mientras que en el nuevo, está en `src/features/settings/components/SettingsGeneral.tsx`.

- **Páginas**: En el proyecto anterior, la organización de páginas era inconsistente. Los archivos bajo el directorio `/routes` eran las rutas para React Router. En estos, se determinaba qué comprobaciones hacer antes de renderizar la página, como comprobar que el usuario ha iniciado sesión, además de declarar el componente que renderizar en esa ruta. Por ejemplo, esta era la ruta `/$lang/settings/general` para los ajustes de usuario:

  ```tsx
  import { isLoggedIn } from '@/hooks/useAuth'
  import { DashboardLayout } from '@/layouts/dashboard'
  import AccountGeneralPage from '@/pages/settings/general'
  import { AccountLayout } from '@/sections/account/account-layout'
  import { createFileRoute, redirect } from '@tanstack/react-router'

  export const Route = createFileRoute('/$lang/settings/general')({
    component: RouteComponent,
      beforeLoad: async ({ params }) => {
        if (!isLoggedIn()) {
          throw redirect({ to: "/$lang/login", params: { lang: params.lang } })
        }
      },
  })

  function RouteComponent() {
    return (
      <DashboardLayout sx={undefined} cssVars={undefined} slotProps={undefined}>
        <AccountLayout>
          <AccountGeneralPage />
        </AccountLayout>
      </DashboardLayout>
    )
  }
  ```

  Este es un ejemplo de un archivo de ruta limpio. Si el usuario ha iniciado sesión, devuelve la página AccountGeneralPage anidada en el layout del tablero (`DashboardLayout`) y de los ajustes de cuenta (`AccountLayout`). Sin embargo, `AccountGeneralPage` (`src/pages/settings/general.tsx`) contiene dentro `AccountGeneralView` (`src/sections/account/view/account-general-view.tsx`), que devuelve `AccountGeneral` (`frontend/src/sections/account/account-general.tsx`), que contiene los componentes visuales y el formulario de actualización de información del usuario.

  Algunas páginas del proyecto hacen lo contrario: en vez de tener demasiados niveles, la página entera se encuentra en el archivo de la ruta. Este es el caso de las pantallas del panel de administrador, como `src/routes/$lang/admin-panel/admin.tsx`.

  El nuevo proyecto utiliza el [Pages Router](https://nextjs.org/docs/pages) de Next.js. Así se ve el archivo de ruta de los ajustes de usuario:

  ```tsx
  import { useTranslation } from 'next-i18next'
  import { DashboardLayout } from '../../src/components/layouts/dashboard'
  import { SettingsLayout } from '../../src/features/settings/components/SettingsLayout'
  import { SettingsGeneral } from '../../src/features/settings/components/SettingsGeneral'
  import { withAuth } from '../../src/lib/auth/with-auth'

  export const getServerSideProps = withAuth()

  export default function GeneralSettingsPage() {
    const { t } = useTranslation('translation')

    return (
      <DashboardLayout>
        <SettingsLayout>
          <SettingsGeneral />
        </SettingsLayout>
      </DashboardLayout>
    )
  }
  ```

  `withAuth()` es un helper para obtener el usuario actual como contexto y las traducciones del servidor a la vez.

  **NOTA**: Antes de Next.js 13, Pages Router era la manera principal de crear rutas. Aunque sigue estando soportada en las versiones más recientes de Next.js, se recomienda migrar al App Router en un futuro.

- **Permiso de acceso**: En vez de hacerlo individualmente por rutas, es el archivo `proxy.ts` el que determina a qué rutas pueden acceder los usuarios según su rol. Por defecto, cualquier ruta que empiece por `/admin` requiere que el usuario actual sea un superusuario y cualquier ruta que no sea pública (las de inicio de sesión/registro, conexión exitosa y errores) requiere que el usuario actual haya iniciado sesión. Si no cumple los requisitos, se redirigirá:
  - En el caso de rutas de administrador, a una página de error.
  - En el caso de rutas privadas, a la pantalla de inicio de sesión.
  - En el caso de rutas de inicio de sesión y registro, si el usuario ya ha iniciado sesión, se le redirige a la página principal.

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
- [How subscriptions work](https://docs.stripe.com/billing/subscriptions/overview)

La mayoría de la documentación de Stripe está traducida al español y se puede seleccionar el idioma en la parte inferior izquierda de la página.

### Onboarding

El onboarding de la aplicación en el repositorio full stack funciona con un overlay de [NextStepJS](https://nextstepjs.com/) altamente personalizado, en el que los pasos se cargan desde el backend.

- **`src/routes/$lang/index.tsx`**: lee las respuestas a las preguntas del onboarding del usuario actual y selecciona las preguntas sin responder o las preguntas con una respuesta autocompletada. Si hay preguntas que cumplen esos criterios, muestra el onboarding con esas preguntas. Hay lógica especial para manejar el caso en el que el usuario ha especificado la URL de su WordPress, pero no ha terminado de establecer la conexión, para mostrarle la pregunta de la URL de nuevo.
- **`src/components/onboarding/steps.tsx`**: maneja el orden de las preguntas y la lógica para enviar la respuesta y pasar a la siguiente. Muestra la entrada de texto y/o los botones necesarios según la pregunta.
- **`src/components/onboarding/custom-card.tsx`**: la tarjeta en la que se muestra el título de la pregunta y el contenido necesario para responderla, proveniente de `steps.tsx`.

La gran desventaja que tiene esta solución es que el onboarding solo se muestra en la pantalla de los cuatro agentes y que es posible esquivar el onboarding pulsando el botón de atrás en el ratón o en el navegador, o introduciendo una URL que no sea de la página de los cuatro agentes. Entonces, un usuario podría utilizar la aplicación sin haber introducido la información de su negocio. Si esto ocurre, los flujos fallarán al ejecutarse por la falta de contexto de la empresa del usuario.

La solución propuesta actualmente es una pantalla de onboarding separada, con su propia ruta (/onboarding), a la que se redirige al usuario si intenta acceder a cualquier otra pantalla sin haber respondido a todas las preguntas. En `feat/onboarding` se encuentra la ruta y el diseño de la pantalla, con preguntas de ejemplo que no se envían al backend.

**Nota de internacionalización**: en el proyecto full stack, las preguntas y sus descripciones no estaban traducidas porque venían directamente del backend. Si son preguntas que van a variar a menudo, se debería definir las traducciones en la base de datos. Si son fijas, se puede añadir las claves a los archivos de traducción.

### Referidos

La pantalla de referidos está en el nuevo repositorio con datos de prueba y con el enlace ocultado. Esto se debe a que la lógica de referidos está por implementar ya que depende de la gestión del balance de créditos. La nueva versión de AI Shop Helper permite ser propietario de más de una organización a la vez, por lo que los créditos obtenidos de invitar a usuarios no deberían ser asignados a una automáticamente. En cambio, deberían sumarse al balance actual de créditos para que el beneficiario pueda utilizarlos como desee. El límite mensual de referidos debería tratarse como el número máximo de personas invitadas en un mes que darán créditos a la persona que las invitó. Si el límite es 10, alguien puede invitar a 100 personas, pero solo recibirá los créditos de los 10 primeros invitados.

### Créditos y ajustes de facturación

La plantilla de ajustes de facturación tiene componentes que sobran en nuestro caso. La idea propuesta de ajustes de facturación es:

- Tarjeta superior izquierda: título "Tu plan actual", cuerpo con selector de plan (Starter, Pro, Business, Enterprise) con el plan actual seleccionado y resaltado, botón para cambiar plan que se activa al seleccionar un plan distinto del actual. Al seleccionar otro plan, el título de la tarjeta cambia a "Cambiar plan".
- Tarjeta derecha: lista de pagos recientes.
- Tarjeta inferior izquierda: información sobre la suscripción actual:
  - Nombre de facturación
  - Dirección de facturación (si es necesaria)
  - Método de pago: [Visa/MasterCard] acabada en [1234], Apple Pay, Google Pay, etc. **Importante**: NO guardamos tarjetas de crédito enteras en nuestra base de datos. Como mucho, almacenamos los últimos 4 dígitos para poder mostrar esta información.
  - Próximo pago: Tu suscripción se renovará el [día] de [mes].

Esta información se puede obtener de Stripe. La suscripción activa de un usuario, si se conoce su ID de [cliente](https://docs.stripe.com/billing/customer), que podemos almacenar cuando realice un pago, se obtiene con la siguiente llamada a la API:

```bash
curl -G https://api.stripe.com/v1/subscriptions \
  -u "sk_test_your_key:" \
  -d customer={{CUSTOMER_ID}} \
  -d status=active
```

Para obtener más información aún, incluyendo del usuario, se puede expandir la llamada a GET /customers:

```bash
curl -G https://api.stripe.com/v1/customers/{{CUSTOMER_ID}} \
  -u "sk_test_your_key:" \
  -d "expand[]=subscriptions"
```

Como fue mencionado en la sección anterior, los créditos no serán asignados automáticamente a una organización, sino que serán parte de un balance de créditos del usuario, que luego podrá asignar créditos a organizaciones en las que tenga permiso de administración. Se debería añadir dos contadores de créditos: el de usuario y el de organización. El contador de créditos de organización se puede hacer a partir de la implementación de créditos de proyecto en el repositorio full stack, para que aparezca a la derecha del nombre del proyecto actual seleccionado.

### Notificaciones

La pantalla de notificaciones está implementada con datos simulados, por lo que siempre aparece una notificación sin leer en la barra lateral para demostrar cómo se vería. Actualmente, el número de notificaciones se define en los ajustes de la barra lateral con la propiedad `notificationCount`. Sin embargo, esta solución no es óptima y puede que deje de servir cuando se tenga que empezar a obtener el número de notificaciones sin leer de la base de datos.

### Gestión de organizaciones y proyectos

La implementación de la pantalla de organizaciones está basada en la original de proyectos. Puede que todavía haya referencias a esta, así que se debe cambiar. En ambas pantallas falta la opción de unirse a una organización o a un proyecto. Actualmente se puede gestionar los miembros de una organización, para cambiar sus roles y eliminarlos de ella, pero no los de un proyecto.

### Pantallas de admin

Aunque no son estrictamente necesarias para sacar la aplicación, simplifican el acceso a la base de datos. No deberían ser muy complejas. Las nuevas pantallas de admin que vayan a listar datos como proyectos, organizaciones o flujos se pueden crear a partir de las que ya existen, como la de usuarios. Solo hay que cambiar las llamadas a la API y los datos que se introducen y envían en los formularios de creación y edición, si se van a añadir.

### Internacionalización

Algunas de las nuevas cadenas de texto añadidas a la aplicación durante la migración no han sido internacionalizadas. Para saber cómo añadir sus traducciones, consulta la documentación del proyecto full stack. Ahí aparece en detalle el proceso. Sin embargo, hay algunas diferencias respecto a cómo trabajábamos antes con las traducciones:

- **Rutas**: no es necesario incluir el prefijo `$lang` en los enlaces, ni poner las rutas con internacionalización en un directorio `$lang`.
- **Configuración**: para añadir nuevos idiomas o quitar otros, modifica la lista de locales en `next-i18next.config.js` y `next.config.ts`.

Otro aspecto que tener en cuenta es que, al tener más idiomas, es necesario validar más traducciones, ofrecer soporte en ellos e, idealmente, hacer marketing en cada uno de ellos. Por tanto, tal vez habría que considerar deshabilitar temporalmente las traducciones a francés, alemán y portugués. Estas traducciones se hicieron a máquina, así que se podría pedir traducciones a los futuros becarios que vengan de Erasmus.

#### Mensajes de error

Hay claves en los archivos de internacionalización para mensajes de error del backend. En el proyecto full stack, el backend utilizó estos códigos de error como mensajes, que luego pasaban al `handleError` del frontend para mostrar un toast de error con el mensaje traducido correspondiente a la clave recibida. Sin embargo, esto no está en el proyecto actual y vale la pena reimplementarlo. Para ver cómo funciona, mira `src/hooks/useHandleError.ts`.

## Consideraciones para continuar con el desarrollo

### Entorno

- **Orval**: Para generar el código de cliente a partir de la versión más reciente de la API, ejecuta `./pull-openapi.sh`. **Importante:** esto requiere configurar la CLI de AWS con tu usuario.

- **Stripe**: Para poder realizar pagos de prueba de Stripe, necesitarás claves del panel de control de Stripe. Asegúrate de que estas claves tengan `_test_` en ellas en el entorno de desarrollo y que **nunca** se despliegue la aplicación con claves de prueba o con claves privadas fuera del archivo `.env`.

### Ejecución

Hay tres maneras de ejecutar el frontend:

- **`bun dev`**: en modo desarrollo, con recarga en caliente. Si `bun` no está instalado, prueba `npx bun dev`.
- **Con `docker-compose.dev.yml`**: en modo desarrollo, con recarga en caliente.
- **Con `docker-compose.yml`**: en modo producción, sin recarga en caliente.

El modo desarrollo carga las pantallas más lento que el de producción debido a que no están guardadas de antemano en el servidor. El icono de Next.js que aparece en una de las esquinas es una herramienta de desarrollo que solo viene activada en el modo de desarrollo. Si estorba, se puede desactivar añadiendo `devIndicators: false` a `next.config.js`.

### Precommit

Antes de hacer commit, si no se añade `--no-verify` al comando, se lanza una rutina de precommit que se encuentra en `.pre-commit-config.yaml`. Primero ejecuta `./pull-openapi.sh`, luego comprueba la sintaxis de los archivos YAML y JSON y acaba ejecutando Prettier en los archivos modificados para que cumplan las reglas de estilo definidas en `.prettierrc`. Si aparece un aviso, que suele ocurrir cuando ha habido cambios en la API o cuando Prettier ha modificado archivos, habrá que stagear los archivos de nuevo para poder hacer el commit.

**NOTA:** Si ha habido una actualización de la API antes de hacer commit de una funcionalidad nueva y esta actualización afecta a los cambios recientes, revisa el funcionamiento del frontend con los cambios antes de continuar con el commit.

### Errores comunes

Si la aplicación dockerizada da un error parecido a este:

```h
Failed to load external module next-i18next-72a9335eea5cea01: ResolveMessage: Cannot find package 'next-i18next-72a9335eea5cea01' from '/app/.next/dev/server/chunks/ssr/[root-of-the-server]__22ec9fe0._.js'
```

Borra el directorio `.next` y ejecuta el contenedor de nuevo. Esto ocurre al levantar contenedor de desarrollo tras haber levantado y apagado el de producción.

Al construir una imagen de Docker tras instalar o desinstalar paquetes, es posible que `bun` falle por un _segmentation fault_. Al intentarlo de nuevo, los paquetes se deberían actualizar sin problemas.
