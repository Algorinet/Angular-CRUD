var aplicacion = angular.module("aplicacion", []);
//Añadimos $http para realizar peticiones Ajax
aplicacion.controller("Usuarios", function($scope, $http) {
  $scope._id = null;
  $scope.name = "";
  $scope.email = "";
  $scope.birthDay = "";
  $scope.street = "";
  $scope.state = "";
  $scope.city = "";
  $scope.country = "";
  $scope.zip = "";

  $scope.usuarios = [];

  $scope.showModal = function() {
      console.log("showmodal")
    
    $modal.open({
      templateUrl: "add-miembros.html"
    });
  };

  //Función para listar todos los usuarios
  $scope.listarUsuarios = function() {
    console.log("Función listar usuarios");
    $http({
      method: "GET",
      url: "/getusers" //Le decimos que use el endpoint "/getusers"
    })
      .success(function(data) {
        if (typeof data == "object") {
          $scope.usuarios = data;
          console.log(data);
        } else {
          alert("Error al intentar recuperar los usuarios.");
        }
      })
      .error(function() {
        alert("Error al intentar recuperar los usuarios.");
      });
  };

  //Función para listar un usuario
  $scope.detalleUsuario = function(indice) {
    $http({
      method: "GET",
      url: "/getusersById",
      params: {
        _id: indice
      }
    })
      .success(function(data) {
        if (typeof data == "object") {
          $scope.name = data.name;
          $scope.email = data.email;
          $scope.birthDay = data.birthDay;
          $scope.street = data.street;
          $scope.state = data.state;
          $scope.city = data.city;
          $scope.country = data.country;
          $scope.zip = data.zip;
        } else {
          alert("Error al intentar recuperar el cliente.");
        }
      })
      .error(function() {
        alert("Error al intentar recuperar el cliente.");
      });
  };

  $scope.editarUsuario = function(indice) {
    $scope.detalleUsuario(indice);
  };

  // Función para crear un usuario
  $scope.crearUsuario = function(indice) {
    console.log(indice);
    $http({
      method: "POST",
      url: "/createUsers",
      params: {
        _id: indice,
        name: $scope.name,
        email: $scope.email,
        birthDay: $scope.birthDay,
        street: $scope.street,
        state: $scope.state,
        city: $scope.city,
        country: $scope.country,
        zip: $scope.zip
      }
    })
      .success(function(data) {
        if (typeof data == "object") {
          $scope.limpiarFormulario();
          $scope.listarUsuarios();
        } else {
          alert("Error al intentar crear el usuario.");
        }
      })
      .error(function() {
        alert("Error al intentar crear el usuario.");
      });
  };

  // Llamada Ajax para eliminar usuario
  $scope.eliminarUsuario = function(indice) {
    $http({
      method: "POST",
      url: "/deleteUsersById",
      params: {
        _id: indice
      }
    })
      .success(function(data) {
        if (data == "Ok") {
          $scope.limpiarFormulario();
          $scope.listarUsuarios();
        } else {
          alert("Error al eliminar el usuario.");
        }
      })
      .error(function() {
        alert("Error al intentar eliminar el usuario.");
      });
  };

  $scope.limpiarFormulario = function() {
    $scope._id = null;
    $scope.name = "";
    $scope.email = "";
    $scope.birthDay = "";
    $scope.street = "";
    $scope.state = "";
    $scope.city = "";
    $scope.country = "";
    $scope.zip = "";
  };
});
