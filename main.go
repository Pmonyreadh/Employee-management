package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)
type Employee struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"` // Using MongoDB ID
	FirstName   string             `json:"first_name" bson:"first_name" validate:"required,min=2,max=50"`
	LastName    string             `json:"last_name" bson:"last_name" validate:"required,min=2,max=50"`
	
	Gender      string             `json:"gender" bson:"gender" validate:"required,oneof=Male Female Other"`
	Email       string             `json:"email" bson:"email" validate:"required,email"`
	Phone       string             `json:"phone_number" bson:"phone_number" validate:"required,min=10,max=15"`
	JobTitle    string             `json:"job_title" bson:"job_title" validate:"required,min=2,max=50"`
	Department  string             `json:"department" bson:"department" validate:"required,min=2,max=50"`
}

var collection *mongo.Collection
var validate *validator.Validate

func main() {
	fmt.Println("Hello Worlds!")

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file:", err)
	}

	MONGODB_URI := os.Getenv("MONGODB_URI")
	if MONGODB_URI == "" {
		log.Fatal("MONGODB_URI not found in .env file")
	}

	clientOptions := options.Client().ApplyURI(MONGODB_URI)

	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB!")

	collection = client.Database("golang_db").Collection("employees")

	validate = validator.New()

	validate.RegisterValidation("customDateValidation", func(fl validator.FieldLevel) bool {
		dateStr := fl.Field().String()
		_, err := time.Parse("02-01-2006", dateStr)
		return err == nil
	})

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept"},
	}))
	
	app.Get("/api/employees", getEmployees)
	app.Post("/api/employees", createEmployee)
	app.Put("/api/employees/:id", updateEmployee)
	app.Delete("/api/employees/:id", deleteEmployee)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Fatal(app.Listen("0.0.0.0:" + port))
}

// Handler to get all new employee
func getEmployees(c fiber.Ctx) error {
	var employees []Employee

	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch employees",
		})
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var employee Employee
		if err := cursor.Decode(&employee); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to decode employee",
			})
		}
		employees = append(employees, employee)
	}

	if err := cursor.Err(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Cursor error",
		})
	}

	return c.JSON(employees)
}

// Handler to create a new employee
func createEmployee(c fiber.Ctx) error {
	var employee Employee

	// Parse the request body into the Employee struct
	if err := c.Bind().Body(&employee); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON!",
		})
	}

	// Validate the employee struct
	if err := validate.Struct(employee); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Validation failed",
			"details": err.Error(),
		})
	}

	// Insert the new employee into the collection
	result, err := collection.InsertOne(context.Background(), employee)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create employee",
		})
	}

	// Set the generated ID to the employee struct
	employee.ID = result.InsertedID.(primitive.ObjectID)

	// Return the created employee as JSON
	return c.Status(fiber.StatusCreated).JSON(employee)
}

// Handler to update an employee
func updateEmployee(c fiber.Ctx) error {
	id := c.Params("id")

	// Convert the string ID to a MongoDB ObjectID
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid ID format",
		})
	}

	var updatedEmployee Employee

	// Parse the request body into the Employee struct
	if err := c.Bind().Body(&updatedEmployee); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	// Validate the updated employee struct
	if err := validate.Struct(updatedEmployee); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Validation failed",
			"details": err.Error(),
		})
	}

	// Update the employee in the collection
	filter := bson.M{"_id": objectID}
	update := bson.M{"$set": updatedEmployee}

	_, err = collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update employee",
		})
	}

	// Return a success message
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Employee updated successfully",
	})
}

// Handler to delete an employee
func deleteEmployee(c fiber.Ctx) error {
	id := c.Params("id")

	// Convert the string ID to a MongoDB ObjectID
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid ID format",
		})
	}

	// Delete the employee from the collection
	filter := bson.M{"_id": objectID}
	_, err = collection.DeleteOne(context.Background(), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete employee",
		})
	}

	// Return a success message
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Employee deleted successfully",
	})
}