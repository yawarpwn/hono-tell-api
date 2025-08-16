async function main() {
  const options = {
    headers: { 'TELL-API-KEY': 'kakapichipoto' },
  }
  const photos = await fetch('http://localhost:8787/v2/api/gallery', options).then((res) => res.json())

  for (const photo of photos) {
    fetch('http://localhost:8787/v2/api/watermarks', {
      method: 'POST',
      body: JSON.stringify({ ...photo, is_favorite: true }),
      headers: {
        'TELL-API-KEY': 'kakapichipoto',
        'Content-Type': 'application/json',
      },
    })
      .then((r) => {
        if (!r.ok) {
          console.log(r)
          throw new Error(`Failed to insert photo: ${photo.id}`)
        }
        console.log('inserted success id: ', photo.id)
      })
      .catch((e) => {
        console.log('Error inserting')
      })
  }
  //
  // console.log('End')
}

main()
