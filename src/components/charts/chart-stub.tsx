import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

type ChartStubProps = {
  data: { name: string; value: number }[]
}

export function ChartStub({ data }: ChartStubProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Bar
          dataKey="value"
          fill="var(--color-primary)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
