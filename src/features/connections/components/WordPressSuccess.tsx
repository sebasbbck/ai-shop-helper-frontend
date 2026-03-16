import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

export function WordPressSuccess() {
  const { t } = useTranslation()
  // const { currentProject } = useCurrentProject()
  // const [answer, setAnswer] = useState<AnswerPublic | null>(null)
  const router = useRouter()

  /*
  useEffect(() => {
    const handleSuccess = async () => {
      // find the question whose text is "¿Cuál es la URL de tu wordpress?"
      try {
        const questions = await QuestionsService.readQuestions()
        const question = questions.data.find(
          (q) => q.question_text === "Conecta tu WordPress"
        )

        if (!question || !currentProject) return

        setAnswer(await QuestionsService.createAnswer({
          questionId: question.id || "", // this should never be undefined anyway
          requestBody: {
            answer_text: "WordPress conectado con éxito",
            project_id: currentProject.id || "", // this should never be undefined anyway
          },
        }))

      } catch (error) {
        console.warn(error)
        router.push("/connection/failure")
      }
    }

    handleSuccess()
  }, [currentProject])

  useEffect(() => {
    if (answer?.answer_text) {
      router.push("/")
    }
  })
  */

  return <p>{t('translation:connection.success')}</p>
}
