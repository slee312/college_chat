class RoomsController < ApplicationController
  def index
    #new room blank obj
    @new_room = Room.new
    
    #get 10 most recent rooms
    @curr_rooms = Room.desc(:updated_at) .limit(10)

  end

  def create
    name = params[:room][:name].strip

    new_room = Room.create(name: name, location: [params[:room][:lat], params[:room][:long]])

    unless new_room.errors.any?
      flash[:success] = "Room: " + name + " is created."

    else 
        flash[:danger] = new_room.errors.full_messages.first
    end

    redirect_to listings_path
  end

  def show
    @room = Room.find(params[:id])
    @new_message = @room.messages.new
  end
end
