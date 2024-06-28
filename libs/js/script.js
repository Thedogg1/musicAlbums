// assign event listeners


$('#editAlbumForm').on('submit', function (e) {
  e.preventDefault();
  editAlbums();
});

$('#newAlbumForm').on('submit', function (e) {
  e.preventDefault();
  newAlbum();
});

$('#deleteAlbumForm').on('submit', function (e) {
  e.preventDefault();
  deleteAlbum();
});



$('#addBtn').click(function () {
  if (document.getElementById("newReleaseYear").length==0){
  for (let x = 2024; x > 1919; x--){
    $('#newReleaseYear').append(
      $('<option>', {
        value: x,
        text: x,
      })
    );
   }
  }
  $('#newAlbumStatus').html('');
  $('#newAlbumModal').modal('show');


});


$("#selectAlbum").change(function () {
 
      $("#selectArtist").val('All');    
    getAlbumFilter();  
      
  
})

$("#selectArtist").change(function () {
 
  $("#selectAlbum").val('All');    
getArtistFilter();  
  

})

$('#refreshBtn').click(function () {
      
    $('#albumTableBody tr').remove();
    getAllData();
 
    
 

  
});

//Get all grid data


function getAllData() { 
    $.ajax({
      url: './libs/php/getAll.php',
      type: 'POST',
      dataType: 'json',
  
      success: function (result) {
        createAlbumTable(result.data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#editAlbumModal .modal-title').replaceWith(
          'Error retrieving data'
        );
      },
    });
  }






function createAlbumTable(data) {
  
  
    $('#albumTableBody tr').remove();
  
   let value;
  
    var rows = "";
  
    data.forEach(function(item, index) {
  let id=item.albumID;
      value="<td class='text-end text-nowrap'>" +
      "<button type='button' class='btn btn-primary btn-sm' data-bs-toggle='modal'" +
      "data-bs-target='#editAlbumModal' data-id=" +
      id +
      '>' +
      "<i class='fa-solid fa-pencil fa-fw'></i>" +
      '</button>' +
      "<button type='button' class='btn btn-primary btn-sm deletealbumBtn ms-1' data-bs-toggle='modal'" +
      "data-bs-target='#deleteAlbumModal' data-id=" +
      id +
      '>' +
      "<i class='fa-solid fa-trash fa-fw'></i></button></td></tr>";
      
      rows += `<tr><td class='align-middle text-nowrap'>${item.albumName}</td><td class='align-middle text-nowrap d-none d-md-table-cell'>${item.artistName}</td> <td class='align-middle text-nowrap d-none d-md-table-cell'>${item.year_release}</td><td class= 'align-middle text-nowrap d-none d-sm-table-cell'>${item.ranking}</td>`+value;  
      
    });
    
    $('#albumTableBody').append(rows);
  
  }
  getAllData();


  $('#editAlbumModal').on('show.bs.modal', function (e) {
    $.ajax({
      url: './libs/php/getAlbumsByID.php',
      type: 'POST',
      dataType: 'json',
      data: {
        albumID: $(e.relatedTarget).attr('data-id'), 
      },
      success: function (result) {
       
        var resultCode = result.status.code;
      
        if (resultCode == 200) {
         //populate select box
          if (document.getElementById('editReleaseYear').length==0){
         for (let x = 2024; x > 1919; x--){
          $('#editReleaseYear').append(
            $('<option>', {
              value: x,
              text: x,
            })
          );
         }
        }

         //remove status message
         $('#editAlbumStatus').html('');
  
          $('#editAlbumID').val(result.data[0].albumID);
  
          $('#editAlbumName').val(result.data[0].albumName);
          $('#editArtistName').val(result.data[0].artistName);
          $('#editReleaseYear').val(result.data[0].year_release);
  
          $('#editRanking').val(
            result.data[0].ranking
          );
         
         
         
         
        } else {
          $('#editAlbumModal .modal-title').replaceWith(
            'Error retrieving data'
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#editAlbumModal .modal-title').replaceWith(
          'Error retrieving data'
        );
      },
    });
  });


  function editAlbums() {
    $.ajax({
      url: './libs/php/editAlbums.php',
      type: 'POST',
      dataType: 'json',
      data: {
        albumName: $('#editAlbumName').val(),
        artistName: $('#editArtistName').val(),
        releaseYear: $('#editReleaseYear').val(),
        
        ranking: $('#editRanking').val(),
        albumID: $('#editAlbumID').val(),
      },
      success: function (result) {
        $('#editAlbumStatus').html(result.data);
        $('#editAlbumStatus').addClass('databaseStatus');
        getAllData();

       
       
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#editAlbumModal .modal-title').replaceWith('Error retrieving data');
      },
    });
    setTimeout(function() {$('#editAlbumModal').modal('hide');}, 3000);
  }


  //insert an album

  function newAlbum() {
    $.ajax({
      url: './libs/php/addAlbum.php',
      type: 'POST',
      dataType: 'json',
      data: {
        albumName: $('#newAlbumName').val(),
        artistName: $('#newArtistName').val(),
        ranking: $('#newRanking').val(),
        year_release: $('#newReleaseYear').val(),
        
      },
      success: function (result) {
        
        $('#newAlbumStatus').html(result.data);
        $('#newAlbumStatus').addClass('databaseStatus');
        setTimeout(function() {$('#newAlbumModal').modal('hide');}, 3000);
        getAllData();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#newAlbumModal .modal-title').replaceWith('Error retrieving data');
      },
    });
  }


  //delete an album

  function deleteAlbum() {
    $.ajax({
      url: './libs/php/deleteAlbum.php',
      type: 'POST',
      dataType: 'json',
      data: {
        albumID: $('#deleteAlbumID').val(),
        albumName:  $('#deleteAlbumName').val(),
      },
      success: function (result) {
        $('#deleteAlbumStatus').html(result.status);
        $('#deleteAlbumStatus').addClass('databaseStatus');
  
        setTimeout(function() {$('#deleteAlbumModal').modal('hide');}, 3000);
        getAllData();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#deleteAlbumModal .modal-title').replaceWith('Error retrieving data');
      },
    });
  }
  

  //fill in delete modal

  $('#deleteAlbumModal').on('show.bs.modal', function (e) {
    let id = $(e.relatedTarget).attr('data-id');
    $('#deleteAlbumID').val(id);
   
    $('#deleteAlbumStatus').html('');
  
  
  let deleteText;
  
    let albumID = $('#deleteAlbumID').val();
  
    $.ajax({
      url: './libs/php/getAlbumsByID.php',
      type: 'POST',
      dataType: 'json',
      data: {
        albumID: albumID,
      },
  
      success: function (result) {
        console.log(result.data[0].albumName);
        var resultCode = result.status.code;   
        if (resultCode == 200) {
          $('#deleteAlbumName').val(result.data[0].albumName);      
          // let saveButton = document.getElementById('btnDeleteAlbum');    
          // let closeButton = document.getElementById('btnCloseDeleteAlbum');  
              
          
            deleteText="You are about to permanently delete <b>"+ result.data[0].albumName +"</b> from the system. Are you sure you want to proceed?"
            //saveButton.hidden = false;
           // closeButton.innerText="NO";
          
          $('#delAlbumText').html(deleteText);
          
        } 
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#deleteAlbumModal .modal-title').replaceWith('Error retrieving data');
      },
    });
  
  });
  
  //search modal pre load

  $('#searchModal').on('show.bs.modal', function (e) {
  
    $.ajax({
      url: './libs/php/getAllAlbums.php',
      type: 'POST',
      dataType: 'json',
  
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {
         
          $('#selectAlbum').append(
            $('<option>', {
              value: "All",
              text: "All",
            })
          );
        
          for (x = 0; x < result.data.length; x++) {
            $('#selectAlbum').append(
              $('<option>', {
                text: result.data[x].albumName,
                value: result.data[x].albumName
               
              })
            );
          }
          $('#selectAlbum').val('All');
        } else {
          $('#searchModal .modal-title').replaceWith('Error retrieving data');
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#searchModal .modal-title').replaceWith('Error retrieving data');
      },
    });
    $.ajax({
      url: './libs/php/getAllArtists.php',
      type: 'POST',
      dataType: 'json',
  
      success: function (result) {
        var resultCode = result.status.code;
        
        if (resultCode == 200) {
          
         $('#selectArtist').empty();
          $('#selectArtist').append(
            $('<option>', {
              value: 'All',
              text: 'All',
            })
          );
          for (x = 0; x < result.data.length; x++) {
            $('#selectArtist').append(
              $('<option>', {
                text: result.data[x].artistName,
                value: result.data[x].artistName,
               
              })
            );
          }
          $('#selecArtist').val(0);
        } else {
          $('#searchModal .modal-title').replaceWith('Error retrieving data');
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#searchModal .modal-title').replaceWith('Error retrieving data');
      },
    });
  });
  // search for albums

  function getAlbumFilter() {

    let albumName = $('#selectAlbum').val();
   
    $.ajax({
      url: './libs/php/filterByAlbum.php',
      type: 'POST',
      dataType: 'json',
      data: {
        album: albumName,
      },
  
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {
        
          createAlbumTable(result.data);
          $('#searchModal').modal('hide')
         
        } else {
          $('#searchModal .modal-title').replaceWith('Error retrieving data');
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#searchModal .modal-title').replaceWith('Error retrieving data');
      },
    });
  }
  
  // search for artists

  function getArtistFilter() {

    let artistName = $('#selectArtist').val();
   
    $.ajax({
      url: './libs/php/filterByArtist.php',
      type: 'POST',
      dataType: 'json',
      data: {
        artist: artistName,
      },
  
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {
        
          createAlbumTable(result.data);
          $('#searchModal').modal('hide');
         
        } else {
          $('#searchModal .modal-title').replaceWith('Error retrieving data');
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $('#searchModal .modal-title').replaceWith('Error retrieving data');
      },
    });
  }
  
 