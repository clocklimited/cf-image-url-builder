module.exports =
  [ { _id: 'a1', crops: annotate([ { name: 'Square', src: 'a1-square' } ], 'a1 crops') }
  , { _id: 'a2', crops: annotate([ { name: 'Square', src: 'a2-square' } ], 'a2 crops') }
  , { _id: 'a3', crops: annotate([ { name: 'Square', src: 'a3-square' } ], 'a3 crops') }
  , { _id: 'a4', crops: annotate([ { name: 'Square', src: 'a4-square' } ], 'a4 crops') }
  ]

function annotate(array, note) {
  array._note = note
  return array
}