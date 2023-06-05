function hello() {
  console.log('hello from grpseek')
}
// Function to make gRPC requests
// User passes in requestPayload (object) matching proto schema
async function makeGrpcRequest(requestPayload, clientMethod) {
  // Construct your request payload
  // const requestPayload = {
  //   // ... populate with request data
  //   name: ''
  // };

  // Call the gRPC method
  return new Promise((resolve, reject) => {
    clientMethod(requestPayload, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}
// Main execution function
async function run() {
  try {
    const response = await makeGrpcRequest();
    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // You can add any cleanup or additional logic here
    console.log('Done')
  }
}
// Run the script
run();

module.exports = hello;