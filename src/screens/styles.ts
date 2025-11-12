import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    width: '100%',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sessionText: {
    fontSize: 18,
    marginBottom: 20,
  },
   container1: { 
    flex: 1, padding: 20, backgroundColor: '#fff' 
},
   location: { 
    textAlign: 'center', marginTop: 10, color: '#555' 
},
   image: { 
    width: '100%', height: 200, marginVertical: 10, borderRadius: 8 
},
   input2: { 
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginVertical: 10 
},
 title2: { 
    fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 
},
});

export default styles;