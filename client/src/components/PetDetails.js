import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { petImages } from '../images';
import { FaPaw, FaMapMarkerAlt, FaRuler, FaVenusMars, FaBirthdayCake, FaPhone } from 'react-icons/fa';
import './Navigation.css';
import './PetDetails.css';

const PetDetails = () => {
  const { id } = useParams();

  const [selectedImage, setSelectedImage] = useState(0);

  // Mock pets data with multiple images
  const pets = [
    {
      id: 1,
      name: 'Leo',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: 'Puppyhood',
      gender: 'Male',
      location: 'Noida, Uttar Pradesh',
      size: 'Large',
      images: [
        petImages.dogs.goldenRetriever.main,
        petImages.dogs.goldenRetriever.profile,
        petImages.dogs.goldenRetriever.playing,
        petImages.dogs.goldenRetriever.resting
      ],
      description: 'Friendly and energetic Golden Retriever looking for an active family.',
      owner: {
        name: 'Ramya Singh',
        phone: '+91 98765 43210',
        icon: '👤'
      },
      fullDescription: 'Leo is a friendly and energetic Golden Retriever puppy who loves to play fetch and go for long walks. He is very social and gets along well with other dogs and children. Leo is house-trained and knows basic commands like sit, stay, and come.',
      temperament: 'Friendly, Energetic, Social, Playful',
      behavior: 'Leo is very affectionate and loves to be around people. He enjoys playing with toys and going for walks. He is well-behaved and responds well to positive reinforcement training.',
      specialNeeds: 'None',
      healthStatus: {
        vaccinated: true,
        neutered: false,
        microchipped: true,
        healthCheck: 'Passed',
        medicalNotes: 'All vaccinations up to date, healthy weight, good dental health'
      },
      history: {
        rescuedFrom: 'Local Animal Shelter',
        timeInShelter: '2 months',
        previousOwner: 'Unknown',
        rescueStory: 'Leo was found as a stray puppy and was taken to the local shelter. He was well-cared for and is ready for a loving home.'
      },
      shelter: {
        name: 'Noida Animal Rescue',
        contact: '+91 98765 43210',
        email: 'info@noidaanimalrescue.org',
        address: '123 Rescue Lane, Noida, Uttar Pradesh 201301',
        hours: 'Monday-Friday: 9AM-6PM, Saturday: 10AM-4PM'
      },
      images: [
        petImages.dogs.goldenRetriever.main,
        ...petImages.dogs.goldenRetriever.gallery
      ]
    },
    {
      id: 2,
      name: 'Milo',
      species: 'Cat',
      breed: 'Persian',
      age: '1 year',
      gender: 'Female',
      location: 'Mumbai, Maharashtra',
      size: 'Medium',
      image: petImages.cats.persian.main,
      description: 'Calm and affectionate Persian cat perfect for a quiet home.',
      owner: {
        name: 'Priya Sharma',
        phone: '+91 87654 32109',
        icon: '👤'
      },
      fullDescription: 'Milo is a calm and affectionate Persian cat who loves to lounge in sunny spots and receive gentle pets. She is very clean and uses her litter box perfectly. Milo enjoys quiet environments and would be perfect for a peaceful home.',
      temperament: 'Calm, Affectionate, Gentle, Quiet',
      behavior: 'Milo is very independent but also loves attention when she wants it. She enjoys being brushed and will purr contentedly for hours. She is well-behaved and doesn\'t scratch furniture.',
      specialNeeds: 'Regular grooming required for long fur',
      healthStatus: {
        vaccinated: true,
        neutered: true,
        microchipped: true,
        healthCheck: 'Passed',
        medicalNotes: 'All vaccinations up to date, healthy weight, good dental health'
      },
      history: {
        rescuedFrom: 'Cat Rescue Organization',
        timeInShelter: '1 month',
        previousOwner: 'Elderly owner who could no longer care for her',
        rescueStory: 'Milo was surrendered by her elderly owner who could no longer provide the care she needed. She is healthy and ready for a new loving home.'
      },
      shelter: {
        name: 'Mumbai Cat Rescue',
        contact: '+91 87654 32109',
        email: 'info@mumbaicatrescue.org',
        address: '456 Cat Street, Mumbai, Maharashtra 400001',
        hours: 'Monday-Friday: 9AM-6PM, Saturday: 10AM-4PM'
      },
      images: [
        petImages.cats.persian.main,
        ...petImages.cats.persian.gallery
      ]
    },
    {
      id: 3,
      name: 'Bunny',
      species: 'Rabbit',
      breed: 'Holland Lop',
      age: '6 months',
      gender: 'Male',
      location: 'Delhi, NCR',
      size: 'Small',
      image: petImages.rabbits.hollandLop.main,
      description: 'Adorable Holland Lop bunny ready to hop into your heart.',
      owner: {
        name: 'Amit Patel',
        phone: '+91 76543 21098',
        icon: '👤'
      },
      fullDescription: 'Bunny is an adorable Holland Lop rabbit who loves to hop around and explore. He is very curious and enjoys playing with rabbit-safe toys. Bunny is litter-trained and loves fresh vegetables.',
      temperament: 'Curious, Playful, Gentle, Social',
      behavior: 'Bunny is very active during dawn and dusk. He enjoys being petted and will thump his feet when happy. He is well-behaved and doesn\'t chew on furniture.',
      specialNeeds: 'Requires fresh hay and vegetables daily',
      healthStatus: {
        vaccinated: true,
        neutered: true,
        microchipped: false,
        healthCheck: 'Passed',
        medicalNotes: 'All vaccinations up to date, healthy weight, good dental health'
      },
      history: {
        rescuedFrom: 'Rabbit Rescue Center',
        timeInShelter: '3 weeks',
        previousOwner: 'Family who moved and couldn\'t take him',
        rescueStory: 'Bunny was surrendered by a family who had to move and couldn\'t take him with them. He is healthy and ready for a new home.'
      },
      shelter: {
        name: 'Delhi Rabbit Rescue',
        contact: '+91 76543 21098',
        email: 'info@delhirabbitrescue.org',
        address: '789 Bunny Lane, Delhi, NCR 110001',
        hours: 'Monday-Friday: 9AM-6PM, Saturday: 10AM-4PM'
      },
      images: [
        petImages.rabbits.hollandLop.main,
        ...petImages.rabbits.hollandLop.gallery
      ]
    },
    {
      id: 4,
      name: 'Rocky',
      species: 'Dog',
      breed: 'Labrador',
      age: '3 years',
      gender: 'Male',
      location: 'Bangalore, Karnataka',
      size: 'Large',
      image: petImages.dogs.labrador.main,
      description: 'Playful and loyal Labrador who loves water and outdoor activities.',
      owner: {
        name: 'Sneha Reddy',
        phone: '+91 65432 10987',
        icon: '👤'
      },
      fullDescription: 'Rocky is a playful and loyal Labrador who absolutely loves water and outdoor activities. He is excellent with children and makes a great family dog. Rocky is very intelligent and learns new commands quickly.',
      temperament: 'Playful, Loyal, Intelligent, Active',
      behavior: 'Rocky loves to swim and play fetch. He is very protective of his family and gets along well with other dogs. He is well-trained and responds to commands immediately.',
      specialNeeds: 'Requires regular exercise and mental stimulation',
      healthStatus: {
        vaccinated: true,
        neutered: true,
        microchipped: true,
        healthCheck: 'Passed',
        medicalNotes: 'All vaccinations up to date, healthy weight, good dental health'
      },
      history: {
        rescuedFrom: 'Labrador Rescue Organization',
        timeInShelter: '1 month',
        previousOwner: 'Owner who couldn\'t provide enough exercise',
        rescueStory: 'Rocky was surrendered by an owner who couldn\'t provide the exercise and attention he needed. He is healthy and ready for an active family.'
      },
      shelter: {
        name: 'Bangalore Dog Rescue',
        contact: '+91 65432 10987',
        email: 'info@bangaloredogrescue.org',
        address: '321 Dog Street, Bangalore, Karnataka 560001',
        hours: 'Monday-Friday: 9AM-6PM, Saturday: 10AM-4PM'
      },
      images: [
        petImages.dogs.labrador.main,
        ...petImages.dogs.labrador.gallery
      ]
    },
    {
      id: 5,
      name: 'Shadow',
      species: 'Cat',
      breed: 'Siamese',
      age: '2 years',
      gender: 'Female',
      location: 'Chennai, Tamil Nadu',
      size: 'Medium',
      image: petImages.cats.siamese.main,
      description: 'Elegant Siamese cat with striking blue eyes and a gentle personality.',
      owner: {
        name: 'Karthik Iyer',
        phone: '+91 54321 09876',
        icon: '👤'
      },
      fullDescription: 'Shadow is an elegant Siamese cat with striking blue eyes and a gentle personality. She is very vocal and loves to communicate with her humans. Shadow is very clean and uses her litter box perfectly.',
      temperament: 'Elegant, Vocal, Gentle, Intelligent',
      behavior: 'Shadow loves to talk and will meow to communicate with you. She enjoys being petted and will follow you around the house. She is very clean and doesn\'t scratch furniture.',
      specialNeeds: 'None',
      healthStatus: {
        vaccinated: true,
        neutered: true,
        microchipped: true,
        healthCheck: 'Passed',
        medicalNotes: 'All vaccinations up to date, healthy weight, good dental health'
      },
      history: {
        rescuedFrom: 'Siamese Cat Rescue',
        timeInShelter: '2 weeks',
        previousOwner: 'Owner who developed allergies',
        rescueStory: 'Shadow was surrendered by an owner who developed severe allergies. She is healthy and ready for a new loving home.'
      },
      shelter: {
        name: 'Chennai Cat Rescue',
        contact: '+91 54321 09876',
        email: 'info@chennaicatrescue.org',
        address: '654 Cat Avenue, Chennai, Tamil Nadu 600001',
        hours: 'Monday-Friday: 9AM-6PM, Saturday: 10AM-4PM'
      },
      images: [
        petImages.cats.siamese.main,
        ...petImages.cats.siamese.gallery
      ]
    },
    {
      id: 6,
      name: 'Tweety',
      species: 'Bird',
      breed: 'Parakeet',
      age: '1 year',
      gender: 'Female',
      location: 'Hyderabad, Telangana',
      size: 'Small',
      image: petImages.birds.parakeet.main,
      description: 'Colorful and chatty parakeet that loves to sing and interact.',
      owner: {
        name: 'Ravi Kumar',
        phone: '+91 98765 12345',
        icon: '👤'
      },
      fullDescription: 'Tweety is a colorful and chatty parakeet who loves to sing and interact with her humans. She can mimic some words and sounds, and enjoys playing with bird toys. Tweety is very social and loves attention.',
      temperament: 'Chatty, Social, Playful, Intelligent',
      behavior: 'Tweety loves to sing and can mimic some words. She enjoys being out of her cage and sitting on your shoulder. She is very social and loves to interact with people.',
      specialNeeds: 'Requires fresh fruits and vegetables daily',
      healthStatus: {
        vaccinated: false,
        neutered: false,
        microchipped: false,
        healthCheck: 'Passed',
        medicalNotes: 'Healthy weight, good feather condition, active and alert'
      },
      history: {
        rescuedFrom: 'Bird Rescue Center',
        timeInShelter: '1 week',
        previousOwner: 'Owner who couldn\'t provide enough attention',
        rescueStory: 'Tweety was surrendered by an owner who couldn\'t provide the attention and care she needed. She is healthy and ready for a new home.'
      },
      shelter: {
        name: 'Hyderabad Bird Rescue',
        contact: '+91 98765 12345',
        email: 'info@hyderabadbirdrescue.org',
        address: '987 Bird Street, Hyderabad, Telangana 500001',
        hours: 'Monday-Friday: 9AM-6PM, Saturday: 10AM-4PM'
      },
      images: [
        petImages.birds.parakeet.main,
        ...petImages.birds.parakeet.gallery
      ]
    },
    {
      id: 7,
      name: 'Hammy',
      species: 'Hamster',
      breed: 'Syrian',
      age: '8 months',
      gender: 'Male',
      location: 'Pune, Maharashtra',
      size: 'Small',
      image: petImages.hamsters.syrian.main,
      description: 'Active and friendly Syrian hamster that loves to explore and play.',
      owner: {
        name: 'Meera Desai',
        phone: '+91 87654 56789',
        icon: '👤'
      },
      fullDescription: 'Hammy is an active and friendly Syrian hamster who loves to explore and play. He enjoys running on his wheel and burrowing in his bedding. Hammy is very curious and loves to investigate new things.',
      temperament: 'Active, Friendly, Curious, Playful',
      behavior: 'Hammy is most active during the evening and night. He loves to run on his wheel and explore his cage. He is gentle and can be handled carefully.',
      specialNeeds: 'Requires a large cage with plenty of bedding',
      healthStatus: {
        vaccinated: false,
        neutered: false,
        microchipped: false,
        healthCheck: 'Passed',
        medicalNotes: 'Healthy weight, good fur condition, active and alert'
      },
      history: {
        rescuedFrom: 'Small Animal Rescue',
        timeInShelter: '2 weeks',
        previousOwner: 'Owner who couldn\'t provide proper care',
        rescueStory: 'Hammy was surrendered by an owner who couldn\'t provide the proper care and attention he needed. He is healthy and ready for a new home.'
      },
      shelter: {
        name: 'Pune Small Animal Rescue',
        contact: '+91 87654 56789',
        email: 'info@punesmallanimalrescue.org',
        address: '456 Hamster Lane, Pune, Maharashtra 411001',
        hours: 'Monday-Friday: 9AM-6PM, Saturday: 10AM-4PM'
      },
      images: [
        petImages.hamsters.syrian.main,
        ...petImages.hamsters.syrian.gallery
      ]
    },
    {
      id: 8,
      name: 'Goldie',
      species: 'Fish',
      breed: 'Goldfish',
      age: '2 years',
      gender: 'Female',
      location: 'Kolkata, West Bengal',
      size: 'Small',
      image: petImages.fish.goldfish.main,
      description: 'Beautiful goldfish that brings tranquility to any home aquarium.',
      owner: {
        name: 'Arjun Sen',
        phone: '+91 76543 98765',
        icon: '👤'
      },
      fullDescription: 'Goldie is a beautiful goldfish that brings tranquility to any home aquarium. She is very active and loves to swim around her tank. Goldie is healthy and has a beautiful golden color.',
      temperament: 'Peaceful, Active, Calm, Social',
      behavior: 'Goldie loves to swim around her tank and explore. She is very peaceful and gets along well with other fish. She enjoys being fed and will swim to the surface when you approach.',
      specialNeeds: 'Requires clean water and proper tank maintenance',
      healthStatus: {
        vaccinated: false,
        neutered: false,
        microchipped: false,
        healthCheck: 'Passed',
        medicalNotes: 'Healthy weight, good color, active and alert'
      },
      history: {
        rescuedFrom: 'Fish Rescue Center',
        timeInShelter: '1 week',
        previousOwner: 'Owner who couldn\'t maintain tank properly',
        rescueStory: 'Goldie was surrendered by an owner who couldn\'t maintain the tank properly. She is healthy and ready for a new home with proper care.'
      },
      shelter: {
        name: 'Kolkata Fish Rescue',
        contact: '+91 76543 98765',
        email: 'info@kolkatafishrescue.org',
        address: '789 Fish Street, Kolkata, West Bengal 700001',
        hours: 'Monday-Friday: 9AM-6PM, Saturday: 10AM-4PM'
      },
      images: [
        petImages.fish.goldfish.main,
        ...petImages.fish.goldfish.gallery
      ]
    },
    {
      id: 9,
      name: 'Spike',
      species: 'Guinea Pig',
      breed: 'American',
      age: '1.5 years',
      gender: 'Male',
      location: 'Ahmedabad, Gujarat',
      size: 'Small',
      image: petImages.guineaPigs.american.main,
      description: 'Gentle and social guinea pig that loves cuddles and fresh vegetables.',
      owner: {
        name: 'Neha Patel',
        phone: '+91 65432 87654',
        icon: '👤'
      },
      fullDescription: 'Spike is a gentle and social guinea pig who loves cuddles and fresh vegetables. He is very vocal and will squeak when he\'s happy or hungry. Spike enjoys being held and petted.',
      temperament: 'Gentle, Social, Vocal, Affectionate',
      behavior: 'Spike loves to squeak and communicate with his humans. He enjoys being held and petted, and loves fresh vegetables. He is very social and loves attention.',
      specialNeeds: 'Requires fresh vegetables and vitamin C supplements',
      healthStatus: {
        vaccinated: false,
        neutered: false,
        microchipped: false,
        healthCheck: 'Passed',
        medicalNotes: 'Healthy weight, good fur condition, active and alert'
      },
      history: {
        rescuedFrom: 'Guinea Pig Rescue',
        timeInShelter: '3 weeks',
        previousOwner: 'Owner who couldn\'t provide proper care',
        rescueStory: 'Spike was surrendered by an owner who couldn\'t provide the proper care and attention he needed. He is healthy and ready for a new home.'
      },
      shelter: {
        name: 'Ahmedabad Guinea Pig Rescue',
        contact: '+91 65432 87654',
        email: 'info@ahmedabadguineapigrescue.org',
        address: '321 Guinea Pig Lane, Ahmedabad, Gujarat 380001',
        hours: 'Monday-Friday: 9AM-6PM, Saturday: 10AM-4PM'
      },
      images: [
        petImages.guineaPigs.american.main,
        ...petImages.guineaPigs.american.gallery
      ]
    },
    {
      id: 10,
      name: 'Luna',
      species: 'Dog',
      breed: 'German Shepherd',
      age: '2 years',
      gender: 'Female',
      location: 'Jaipur, Rajasthan',
      size: 'Large',
      image: petImages.dogs.germanShepherd.main,
      description: 'Intelligent and loyal German Shepherd, great for active families.',
      owner: {
        name: 'Rajesh Sharma',
        phone: '+91 54321 76543',
        icon: '👤'
      },
      fullDescription: 'Luna is an intelligent and loyal German Shepherd who is great for active families. She is very protective and makes an excellent guard dog. Luna is highly trainable and loves to work.',
      temperament: 'Intelligent, Loyal, Protective, Active',
      behavior: 'Luna is very protective of her family and territory. She loves to work and learn new commands. She is excellent with children and makes a great family dog.',
      specialNeeds: 'Requires regular exercise and mental stimulation',
      healthStatus: {
        vaccinated: true,
        neutered: true,
        microchipped: true,
        healthCheck: 'Passed',
        medicalNotes: 'All vaccinations up to date, healthy weight, good dental health'
      },
      history: {
        rescuedFrom: 'German Shepherd Rescue',
        timeInShelter: '1 month',
        previousOwner: 'Owner who couldn\'t provide enough exercise',
        rescueStory: 'Luna was surrendered by an owner who couldn\'t provide the exercise and training she needed. She is healthy and ready for an active family.'
      },
      shelter: {
        name: 'Jaipur Dog Rescue',
        contact: '+91 54321 76543',
        email: 'info@jaipurdogrescue.org',
        address: '654 Dog Street, Jaipur, Rajasthan 302001',
        hours: 'Monday-Friday: 9AM-6PM, Saturday: 10AM-4PM'
      },
      images: [
        petImages.dogs.germanShepherd.main,
        ...petImages.dogs.germanShepherd.gallery
      ]
    },
    {
      id: 11,
      name: 'Whiskers',
      species: 'Cat',
      breed: 'Maine Coon',
      age: '3 years',
      gender: 'Male',
      location: 'Lucknow, Uttar Pradesh',
      size: 'Large',
      image: petImages.cats.maineCoon.main,
      description: 'Majestic Maine Coon with a gentle giant personality.',
      owner: {
        name: 'Anjali Verma',
        phone: '+91 43210 65432',
        icon: '👤'
      },
      fullDescription: 'Whiskers is a majestic Maine Coon with a gentle giant personality. He is very large for a cat but extremely gentle and loving. Whiskers enjoys being brushed and loves to sit in your lap.',
      temperament: 'Gentle, Majestic, Loving, Calm',
      behavior: 'Whiskers is very gentle despite his large size. He loves to be brushed and will purr loudly when happy. He enjoys sitting in laps and being petted.',
      specialNeeds: 'Regular grooming required for long fur',
      healthStatus: {
        vaccinated: true,
        neutered: true,
        microchipped: true,
        healthCheck: 'Passed',
        medicalNotes: 'All vaccinations up to date, healthy weight, good dental health'
      },
      history: {
        rescuedFrom: 'Maine Coon Rescue',
        timeInShelter: '2 weeks',
        previousOwner: 'Owner who couldn\'t provide grooming',
        rescueStory: 'Whiskers was surrendered by an owner who couldn\'t provide the grooming care he needed. He is healthy and ready for a new loving home.'
      },
      shelter: {
        name: 'Lucknow Cat Rescue',
        contact: '+91 43210 65432',
        email: 'info@lucknowcatrescue.org',
        address: '987 Cat Avenue, Lucknow, Uttar Pradesh 226001',
        hours: 'Monday-Friday: 9AM-6PM, Saturday: 10AM-4PM'
      },
      images: [
        petImages.cats.maineCoon.main,
        ...petImages.cats.maineCoon.gallery
      ]
    },
    {
      id: 12,
      name: 'Coco',
      species: 'Bird',
      breed: 'Cockatiel',
      age: '2 years',
      gender: 'Male',
      location: 'Indore, Madhya Pradesh',
      size: 'Small',
      image: petImages.birds.cockatiel.main,
      description: 'Playful cockatiel that loves to whistle and dance.',
      owner: {
        name: 'Vikram Singh',
        phone: '+91 32109 54321',
        icon: '👤'
      },
      fullDescription: 'Coco is a playful cockatiel who loves to whistle and dance. He can mimic some sounds and enjoys playing with bird toys. Coco is very social and loves to interact with his humans.',
      temperament: 'Playful, Social, Musical, Intelligent',
      behavior: 'Coco loves to whistle and can mimic some sounds. He enjoys dancing and playing with toys. He is very social and loves to be out of his cage.',
      specialNeeds: 'Requires fresh fruits and vegetables daily',
      healthStatus: {
        vaccinated: false,
        neutered: false,
        microchipped: false,
        healthCheck: 'Passed',
        medicalNotes: 'Healthy weight, good feather condition, active and alert'
      },
      history: {
        rescuedFrom: 'Bird Rescue Center',
        timeInShelter: '1 week',
        previousOwner: 'Owner who couldn\'t provide enough attention',
        rescueStory: 'Coco was surrendered by an owner who couldn\'t provide the attention and care he needed. He is healthy and ready for a new home.'
      },
      shelter: {
        name: 'Indore Bird Rescue',
        contact: '+91 32109 54321',
        email: 'info@indorebirdrescue.org',
        address: '456 Bird Street, Indore, Madhya Pradesh 452001',
        hours: 'Monday-Friday: 9AM-6PM, Saturday: 10AM-4PM'
      },
      images: [
        petImages.birds.cockatiel.main,
        ...petImages.birds.cockatiel.gallery
      ]
    }
  ];

  // Find the pet based on the ID
  const pet = pets.find(p => p.id === parseInt(id));

  if (!pet) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h1>Pet Not Found</h1>
        <p>The pet you're looking for doesn't exist.</p>
        <Link to="/pets" style={{ 
          display: 'inline-block',
          padding: '1rem 2rem',
          background: '#667eea',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '10px',
          marginTop: '1rem'
        }}>
          Back to Pets
        </Link>
      </div>
    );
  }

  return (
    <div className="pet-details-container">
      {pet ? (
        <>
          <div className="image-gallery">
            <img 
              src={pet.images[selectedImage]} 
              alt={`${pet.name} - Main view`} 
              className="main-image"
            />
            <div className="thumbnail-container">
              {pet.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${pet.name} - View ${index + 1}`}
                  className="thumbnail"
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>

          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            {/* Pet Images */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr 1fr', 
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <img 
                  src={pet.images[0]} 
                  alt={pet.name} 
                  style={{ 
                    width: '100%', 
                    height: '400px', 
                    objectFit: 'cover',
                    borderRadius: '15px'
                  }} 
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <img 
                    src={pet.images[1]} 
                    alt={pet.name} 
                    style={{ 
                      width: '100%', 
                      height: '195px', 
                      objectFit: 'cover',
                      borderRadius: '15px'
                    }} 
                  />
                  <img 
                    src={pet.images[2]} 
                    alt={pet.name} 
                    style={{ 
                      width: '100%', 
                      height: '195px', 
                      objectFit: 'cover',
                      borderRadius: '15px'
                    }} 
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
              {/* Main Content */}
              <div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{pet.name}</h1>
                <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
                  {pet.species} • {pet.breed} • {pet.age} • {pet.gender} • {pet.location}
                </p>

                {/* Description */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3>About {pet.name}</h3>
                  <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>{pet.fullDescription}</p>
                </div>

                {/* Temperament & Behavior */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3>Temperament</h3>
                  <p style={{ marginBottom: '1rem' }}><strong>Personality:</strong> {pet.temperament}</p>
                  <p style={{ lineHeight: '1.8' }}><strong>Behavior:</strong> {pet.behavior}</p>
                </div>

                {/* Health Status */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3>Health Status</h3>
                  <div style={{ 
                    background: '#f8f9fa', 
                    padding: '1.5rem', 
                    borderRadius: '10px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                  }}>
                    <div>
                      <strong>Vaccinated:</strong> {pet.healthStatus.vaccinated ? '✅ Yes' : '❌ No'}
                    </div>
                    <div>
                      <strong>Neutered:</strong> {pet.healthStatus.neutered ? '✅ Yes' : '❌ No'}
                    </div>
                    <div>
                      <strong>Microchipped:</strong> {pet.healthStatus.microchipped ? '✅ Yes' : '❌ No'}
                    </div>
                    <div>
                      <strong>Health Check:</strong> {pet.healthStatus.healthCheck}
                    </div>
                  </div>
                  <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                    <strong>Medical Notes:</strong> {pet.healthStatus.medicalNotes}
                  </p>
                </div>

                {/* History */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3>History</h3>
                  <p><strong>Rescued from:</strong> {pet.history.rescuedFrom}</p>
                  <p><strong>Time in shelter:</strong> {pet.history.timeInShelter}</p>
                  <p><strong>Rescue story:</strong> {pet.history.rescueStory}</p>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                {/* Adopt Button */}
                <div style={{ 
                  background: 'white', 
                  padding: '2rem', 
                  borderRadius: '15px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                  marginBottom: '2rem',
                  textAlign: 'center'
                }}>
                  <h3 style={{ marginBottom: '1rem' }}>Ready to Adopt?</h3>
                  <p style={{ marginBottom: '2rem', color: '#666' }}>
                    Give {pet.name} a loving forever home!
                  </p>
                  <Link to={`/adopt/${pet.id}`} className="btn" style={{ 
                    fontSize: '1.2rem', 
                    padding: '15px 40px',
                    background: '#28a745'
                  }}>
                    Adopt {pet.name}
                  </Link>
                </div>

                {/* Shelter Info */}
                <div style={{ 
                  background: 'white', 
                  padding: '2rem', 
                  borderRadius: '15px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ marginBottom: '1rem' }}>Shelter Information</h3>
                  <p><strong>{pet.shelter.name}</strong></p>
                  <p style={{ marginBottom: '1rem' }}>{pet.shelter.address}</p>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <p><strong>Phone:</strong> {pet.shelter.contact}</p>
                    <p><strong>Email:</strong> {pet.shelter.email}</p>
                  </div>
                  
                  <div>
                    <p><strong>Hours:</strong></p>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>{pet.shelter.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default PetDetails;