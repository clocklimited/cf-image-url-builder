module.exports =
  [ { _id: 'a1', name: 'a1.jpg', crops: annotate([ { name: 'Square', src: 'a1-square' } ], 'a1 crops') }
  , { _id: 'a2', name: 'a2.jpg', crops: annotate([ { name: 'Square', src: 'a2-square' } ], 'a2 crops') }
  , { _id: 'a3', name: 'a3.jpg', crops: annotate([ { name: 'Square', src: 'a3-square' } ], 'a3 crops') }
  , { _id: 'a4', name: 'a4.jpg', crops: annotate([ { name: 'Square', src: 'a4-square' } ], 'a4 crops') }
  ]

function annotate(array, note) {
  array._note = note
  return array
}