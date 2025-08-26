type Props = { progress: number}


export default function ProgressBar({ progress}: Props) {
    return (
        <div className="w-full bg-gray-200 h-2 rounded mb-4">
            <div className="bg-blue-500 h-2 rounded"style={{width: `${progress}%`}}/>
        </div>
    )
}