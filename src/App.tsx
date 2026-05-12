import { useState, type FormEvent } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { ChartStub } from '@/components/charts/chart-stub'
import { FileDropzone } from '@/components/upload/file-dropzone'
import { loginSchema, type LoginFormValues } from '@/lib/validation'

const chartData = [
  { name: 'Upload', value: 12 },
  { name: 'Index', value: 18 },
  { name: 'Retrieve', value: 27 },
]

function App() {
  const [files, setFiles] = useState<File[]>([])
  const { register, handleSubmit, formState } = useForm<LoginFormValues>()

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    void handleSubmit((values) => {
      loginSchema.parse(values)
    })(event)
  }

  return (
    <main className="from-background via-background to-muted/30 text-foreground min-h-screen bg-gradient-to-b">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-16 md:px-10">
        <header className="max-w-3xl space-y-4">
          <p className="text-muted-foreground text-sm font-medium tracking-[0.3em] uppercase">
            MycoAI Retrieval Platform
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">
            Stack-ready console for retrieval, upload, auth, and analytics.
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base leading-7 md:text-lg">
            React Router, TanStack Query, React Hook Form, Zod, Recharts, D3,
            and react-dropzone wired into frontend scaffold.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <form
            className="bg-card border-border rounded-3xl border p-6 shadow-sm"
            onSubmit={onSubmit}
          >
            <div className="mb-4 space-y-2">
              <h2 className="text-lg font-semibold">Auth form</h2>
              <p className="text-muted-foreground text-sm">
                Zod validation via React Hook Form.
              </p>
            </div>
            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-medium">
                Email
                <input
                  className="border-border bg-background rounded-lg border px-3 py-2"
                  type="email"
                  {...register('email')}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Password
                <input
                  className="border-border bg-background rounded-lg border px-3 py-2"
                  type="password"
                  {...register('password')}
                />
              </label>
              <Button type="submit">Validate login</Button>
              {formState.errors.email ? (
                <p className="text-destructive text-sm">Invalid form state</p>
              ) : null}
            </div>
          </form>

          <div className="bg-card border-border rounded-3xl border p-6 shadow-sm">
            <div className="mb-4 space-y-2">
              <h2 className="text-lg font-semibold">Upload + chart</h2>
              <p className="text-muted-foreground text-sm">
                File dropzone and Recharts stub.
              </p>
            </div>
            <div className="grid gap-4">
              <FileDropzone onFilesAccepted={setFiles} />
              <p className="text-muted-foreground text-sm">
                Accepted files: {files.length}
              </p>
              <ChartStub data={chartData} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
