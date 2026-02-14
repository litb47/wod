import { useState } from 'react'
import Modal from '../shared/Modal'
import Button from '../shared/Button'
import { saveCustomExercise } from '../../services/storageService'

const modalities = [
  { key: 'G', label: 'Gymnastics', color: 'bg-gym/20 text-gym border-gym/30' },
  { key: 'W', label: 'Weightlifting', color: 'bg-weight/20 text-weight border-weight/30' },
  { key: 'M', label: 'Monostructural', color: 'bg-mono/20 text-mono border-mono/30' },
]

export default function CustomExerciseModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [modality, setModality] = useState('G')
  const [defaultReps, setDefaultReps] = useState(10)
  const [defaultSets, setDefaultSets] = useState(3)
  const [defaultWeightMale, setDefaultWeightMale] = useState('BW')
  const [defaultWeightFemale, setDefaultWeightFemale] = useState('BW')

  const handleSave = () => {
    if (!name.trim()) return
    const exercise = {
      id: 'custom_' + Date.now().toString(36),
      name: name.trim(),
      modality,
      defaultReps,
      defaultSets,
      defaultWeight: defaultWeightMale,
      defaultWeightMale,
      defaultWeightFemale,
      aliases: [],
    }
    saveCustomExercise(exercise)
    onCreated?.({
      name: exercise.name,
      modality: exercise.modality,
      sets: exercise.defaultSets,
      reps: exercise.defaultReps,
      weightMale: exercise.defaultWeightMale,
      weightFemale: exercise.defaultWeightFemale,
    })
    setName('')
    setModality('G')
    setDefaultReps(10)
    setDefaultSets(3)
    setDefaultWeightMale('BW')
    setDefaultWeightFemale('BW')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Custom Exercise">
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/50">Exercise Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50"
            placeholder="e.g. Turkish Get-up"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/50">Modality</label>
          <div className="flex gap-2">
            {modalities.map(m => (
              <button
                key={m.key}
                onClick={() => setModality(m.key)}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium border transition-colors ${
                  modality === m.key ? m.color : 'bg-white/5 text-white/30 border-transparent'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-white/50">Default Sets</label>
            <input
              type="number"
              value={defaultSets}
              onChange={(e) => setDefaultSets(parseInt(e.target.value) || 0)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-white/50">Default Reps</label>
            <input
              type="number"
              value={defaultReps}
              onChange={(e) => setDefaultReps(parseInt(e.target.value) || 0)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-white/50">Weight (Male)</label>
            <input
              type="text"
              value={defaultWeightMale}
              onChange={(e) => setDefaultWeightMale(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50"
              placeholder="60 kg"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-white/50">Weight (Female)</label>
            <input
              type="text"
              value={defaultWeightFemale}
              onChange={(e) => setDefaultWeightFemale(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-accent/50"
              placeholder="40 kg"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()} className="flex-1">
            Create Exercise
          </Button>
        </div>
      </div>
    </Modal>
  )
}
